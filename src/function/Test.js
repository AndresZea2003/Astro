// Import the dotenv package
import dotenv from 'dotenv';

// Configure dotenv to load the environment variables
dotenv.config();

// Access the environment variable
const openaiApiKey = process.env.PUBLIC_OPENAI_API_KEY;

// import { ChatOpenAI } from "@langchain/openai";
// // import { ChatPromptTemplate } from "@langchain/core/prompts";
//
// const chatModel = new ChatOpenAI({
//     model: "gpt-4o",
//     apiKey: openaiApiKey,
// });

// const prompt = ChatPromptTemplate.fromMessages([
//     [
//         "system",
//         "You are Kike, the expert assistant of PlaceToPay, you only answer questions related to PlaceToPay",
//     ],
//     ["human", "{input}"],
// ]);

// const chain = prompt.pipe(chatModel)

// const result = await chain.invoke({
//     input: "Quien eres?"
// });

// console.log(result);

// -------

// import { ChatOllama } from "@langchain/ollama";
//
// const llm = new ChatOllama({
//     model: "llama3.1",
//     temperature: 0,
//     maxRetries: 2,
//     // other params...
// });
//
// const stream = await llm.stream("Que es GPTo?");
//
// for await (const chunk of stream) {
//     if (chunk.content) {
//         process.stdout.write(chunk.content);
//     }
// }

// -------

import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer";

const loader = new PuppeteerWebBaseLoader("https://docs.placetopay.dev/checkout/create-session", {
    evaluate: async (page) => {
        // Extrae solo las partes importantes de la documentación
        return await page.evaluate(() => {
            // Selecciona los elementos que contienen la información relevante
            // const relevantSections = document.querySelectorAll('main h1, main h2, main p, main ul, main pre');

            // Recorre los elementos seleccionados y construye un texto con ellos
            let importantContent = '';
            // relevantSections.forEach(section => {
            //     importantContent += section.outerHTML + '\n';
            // });

            return importantContent;
        });
    },
});


const docs = await loader.load();

console.log(docs[0].pageContent);

import { ChatOllama } from "@langchain/ollama";
import {ChatPromptTemplate} from "@langchain/core/prompts";

const llm = new ChatOllama({
    model: "llama3.1",
    temperature: 0,
    maxRetries: 2,
    // other params...
});

const prompt = ChatPromptTemplate.fromMessages([
    [
        "system",
        "Resume: " + docs[0].pageContent,
    ],
    ["human", "{input}"],
]);

let chain = prompt.pipe(llm)

const stream = await chain.stream({
    input: 'Resume'
});

for await (const chunk of stream) {
    if (chunk.content) {
        process.stdout.write(chunk.content);
    }
}

// console.log(docs[0].pageContent)