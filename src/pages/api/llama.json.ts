import { createOllama } from "ollama-ai-provider";
import { StreamingTextResponse, streamText } from "ai";
import type { APIRoute } from "astro";

const ollama = createOllama();

export const POST: APIRoute = async ({ request }) => {
    try {
        const result = await streamText({
            model: ollama("llama3.1"),
            messages: [{ role: "user", content: "Cuentame Don quijote de la mancha" }],
        });

        return new StreamingTextResponse(result.toAIStream(), {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });
    } catch (error) {
        console.error("Error occurred:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
};