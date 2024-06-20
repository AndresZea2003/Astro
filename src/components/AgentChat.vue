<script setup>
import { ref, onMounted } from "vue";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { PromptTemplate, ChatPromptTemplate } from "@langchain/core/prompts";

import { OpenAI } from "@langchain/openai";

let chat = ref({
  messages: [
    new AIMessage("system", "Tu eres Kike un asistente creado por Andres Zea"),
  ],
  template: "",
  inputMessage: "",
  model: "gpt-3.5-turbo-instruct",
  apiKey: import.meta.env.PUBLIC_OPENAI_API_KEY,
  temperature: 0.1,
  chain: null,
  res: "",
});

onMounted(async () => {
  // Definir Template

  const prompt = new PromptTemplate({
    template: "{foo} tiene una edad de {bar} y su nickname es {nick}",
    inputVariables: ["foo", "bar", "nick"],
  });

  const formattedPrompt = await prompt.format({
    foo: "Sebastian",
    bar: "18",
    nick: "Tocgle",
  });

  //   console.log(formattedPrompt)

  chat.value.template = formattedPrompt;
});

const sendMessage = async () => {
  const prompt = new PromptTemplate({
    template: "{foo} tiene una edad de {bar} y su nickname es {nick}",
    inputVariables: ["foo", "bar", "nick"],
  });

  const formattedPrompt = await prompt.format({
    foo: "Sebastian",
    bar: "18",
    nick: "Tocgle",
  });

  const llm = new OpenAI({
    model: chat.value.model,
    temperature: chat.value.temperature,
    apiKey: chat.value.apiKey,
  });

  const finalPrompt = ChatPromptTemplate.fromMessages([
    ["system", "Usa la siguiente informacion para resolver las preguntas del usuario"],
    ["system", formattedPrompt],
  ]);

  //   const chain = formattedPrompt.pipe(llm);

  //   const res = await chain.invoke({
  //     messages: [new HumanMessage("Cual es nombre real de tocgle ?")],
  //   });

  const chain = finalPrompt.pipe(llm);

  console.log(
    await chain.invoke({
      messages: [new HumanMessage(chat.value.inputMessage)],
    })
  );

  // const res = await llm.invoke({
  //   messages: [new HumanMessage("Cuenta hasta 10")],
  // });

  // console.log(res);

  //   const prompt = ChatPromptTemplate.fromMessages([
  //     [
  //       "system",
  //       "You are a helpful assistant. Answer all questions to the best of your ability.",
  //     ],
  //     new MessagesPlaceholder("messages"),
  //   ]);

  //   const chain = prompt.pipe(llm);

  //   const res = await chain.invoke({
  //     messages: [
  //       new HumanMessage(
  //         "Dime los colores del objeto que te indique"
  //       ),
  //       new HumanMessage("Arbol"),
  //     ],
  //   });

  //   console.log(chain.document.reader[0].pageContent);

  console.log();
};
</script>

<template>
  <div>
    <span>Hola!</span>
  </div>

  <div :class="`flex bg-gray-300 rounded-md w-full p-2 mt-6 items-center`">
    <button
      class="flex items-center justify-center w-10 h-10 text-gray-400 hover:text-gray-200"
    >
      <!-- Icono de adjuntar (puedes usar cualquier icono que prefieras) -->
      <svg
        class="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15.172 7l-6.414 6.414a2 2 0 002.828 2.828L17 10.828a4 4 0 10-5.656-5.656l-4.95 4.95a6 6 0 108.485 8.485l1.414-1.414"
        ></path>
      </svg>
    </button>
    <textarea
      style="resize: none"
      v-model="chat.inputMessage"
      id="message"
      placeholder="Envía un mensaje a ChatBOT"
      class="bg-transparent flex-1 text-gray-800 placeholder-gray-400 focus:outline-none ml-2 w-full"
    ></textarea>
    <button
      @click="sendMessage()"
      class="flex items-center justify-center w-10 h-10 bg-gray-200 hover:bg-gray-600 text-gray-400 hover:text-gray-200 rounded-full"
    >
      <!-- Icono de enviar -->
      <svg
        class="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        ></path>
      </svg>
    </button>
  </div>
</template>
