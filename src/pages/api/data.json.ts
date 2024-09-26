import type { APIContext } from "astro";
import OpenAI from "openai";

export async function POST({ request }: APIContext): Promise<Response> {
  const openai = new OpenAI({
    apiKey: import.meta.env.PUBLIC_OPENAI_API_KEY,
  });

  const requestBody = await request.json();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const openaiStream = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: requestBody.input }],
          stream: true,
        });

        for await (const chunk of openaiStream) {
          const content = chunk.choices[0]?.delta?.content || "";
          const encoder = new TextEncoder();
          controller.enqueue(encoder.encode(content));
        }
        controller.close();
      } catch (err) {
        console.error(err);
        controller.error(err);
      }
    },
  });

  console.log("stream", stream);

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
