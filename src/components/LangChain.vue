<script setup>
import { ref, onMounted, nextTick } from "vue";

let res = ref("sin respuesta");

import { OpenAI } from "@langchain/openai";

import { Ollama } from "@langchain/community/llms/ollama";

// const go = async () => {

// };
// console.log({ res });

import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";

const getDocument = async () => {
  // const model = new ChatOpenAI({
  //   model: "gpt-4o",
  // });

  const TEMPLATE = `Answer the user's question to the best of your ability.
  You must always output a JSON object with an "answer" key and a "followup_question" key.

  {question}`;

  const prompt = ChatPromptTemplate.fromTemplate(TEMPLATE);

  console.log({ prompt });

  const chain = prompt.pipe(model).pipe(new JsonOutputParser());

  await chain.invoke({ question: "What is the powerhouse of the cell?" });

  // console.log(document.reader[0].pageContent);

  // const model = new OpenAI({
  //   model: "gpt-3.5-turbo", // Defaults to "gpt-3.5-turbo-instruct" if no model provided.
  //   temperature: 0.9,
  //   apiKey: import.meta.env.PUBLIC_OPENAI_API_KEY, // In Node.js defaults to process.env.OPENAI_API_KEY
  // });

  // res.value = await model.invoke(
  //   ["system", document.reader[0].pageContent],
  //   ["human", "Cual es el nombre secreto?"],
  // );
};
</script>
<template>
  <div class="flex items-center justify-center min-h-screen">
    <div
      class="bg-gray-200 flex justify-center items-center"
      style="height: 80dvh; width: 60vmax"
    >
      <div>
        <h1 class="text-3xl font-semibold text-red-900">ChatBot</h1>
        <span class="w-full my-6">{{ res }}</span>
        <button
          @click="getDocument()"
          class="bg-blue-300 p-2 rounded-md w-full"
        >
          Enviar
        </button>
      </div>
    </div>
  </div>
</template>
