import type {APIContext} from "astro";
import {TextLoader} from "langchain/document_loaders/fs/text";
import {ChatOllama} from "@langchain/ollama";
import {ChatPromptTemplate, MessagesPlaceholder} from "@langchain/core/prompts";
import {streamText} from "ai";
import {AIMessage, HumanMessage} from "@langchain/core/messages";

const loader = new TextLoader("src/docs/intro.txt");
const reader = await loader.load();

import {ChatOpenAI} from "@langchain/openai";

import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import type { Document } from "@langchain/core/documents";
import { HtmlToTextTransformer } from "@langchain/community/document_transformers/html_to_text";

export async function POST({request}: APIContext): Promise<Response> {

    const requestBody = await request.json();

    const llm = new ChatOpenAI({
        model: "gpt-4o-mini",
        apiKey: import.meta.env.PUBLIC_OPENAI_API_KEY,
        temperature: 0,
    });

    // const llm = new ChatOllama({
    //     model: "llama3.1",
    //     temperature: 0,
    //     maxRetries: 2,
    // });


    const prompt = ChatPromptTemplate.fromMessages([
        new MessagesPlaceholder("chat_history"),
        ["system", requestBody.initialPrompt],
        // ["system", "Eres un chatbot experto en esta documentación llamado Billy"  + " ."],
        ["user", "{input}"],
    ]);

    // console.log("prompt", prompt.promptMessages);

    const chatHistory = requestBody.messages.map((msg: { content: string, sender: string }) => {
        return msg.sender === 'bot' ? new AIMessage(msg.content) : new HumanMessage(msg.content);
    });

    const chain = prompt.pipe(llm);

    const stream = await chain.stream({
        chat_history: chatHistory,
        input: requestBody.input
    });

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
        async start(controller) {
            for await (const chunk of stream) {
                if (chunk.content) {
                    controller.enqueue(encoder.encode(chunk.content));
                }
            }
            controller.close();
        }
    });

    return new Response(readableStream, {
        headers: {
            "Content-Type": "text/plain",
            "Access-Control-Allow-Origin": "*",
        },
    });
}
