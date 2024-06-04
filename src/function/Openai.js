import OpenAI from "openai";


export async function mainStream(token) {
  const openai = new OpenAI({
    apiKey: token,
  });

  try {
    const stream = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "Cuenta hasta 5" }],
      stream: true,
    });
    for await (const chunk of stream) {
      process.stdout.write(chunk.choices[0]?.delta?.content || "");
      return chunk.choices[0]?.delta?.content || "";
    }
  } catch (err) {
    console.error(err);
  }

  return
}

export function Openaiada() {
  // console.log(process.env.PUBLIC_OPENAI_API_KEY);
  return "Openai";
}
