<script setup>
import { ref, onMounted, nextTick } from "vue";
import axios from "axios";
import ProfileUser from "./ProfileUser.vue";

const message = ref("");
const rows = ref(1);
const maxRows = 9;
const token = import.meta.env.PUBLIC_OPENAI_API_KEY;

const updateRows = () => {
  const lineBreaks = message.value.split("\n").length;
  rows.value = lineBreaks > maxRows ? maxRows : lineBreaks;
};

const allowNewLine = (event) => {
  event.stopPropagation();
};

const handleKeyDown = (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    fetchStream();
  }
};

let messages = ref([
  {
    isUser: false,
    message: `Hola! Soy un chatBOT, actualmente Andres Zea me ha agregado las funcionaliadades de:
  - Envio de mensajes
  - Envio de mensajes con bloques de código
  - Envio de mensajes con bloques de código y resaltado de sintaxis
  - Env`,
  },
]);

const sendMessage = () => {
  let input = document.getElementById("message");
  messages.value.push({
    isUser: true,
    message: input.value,
  });

  axios
    .post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "Tu eres un asistente llamado PavoGranaino",
          },
          {
            role: "user",
            content: input.value,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    )
    .then((response) => {
      console.log(response.data.choices[0].message.content);
      messages.value.push({
        isUser: false,
        message: response.data.choices[0].message.content,
      });
    })
    .catch((error) => {
      res.value = error;
    });

  input.value = "";
  rows.value = 1;
  message.value = "";
};

let res = ref("");
const go = async () => {
  const response = await axios.get("/api/data.json");
  res.value = response.data;
};

let inStream = ref(false);

const fetchStream = async () => {
  let input = document.getElementById("message");
  messages.value.push({
    isUser: true,
    message: input.value,
  });

  try {
    // const response = await fetch("/api/data.json");
    const response = await fetch("/api/data.json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input: input.value }),
    });
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    inStream.value = true;

    let result = "";
    const readStream = async () => {
      const { done, value } = await reader.read();
      if (done) {
        inStream.value = false;
        return;
      }
      result += decoder.decode(value, { stream: true });
      res.value = result;
      await readStream();
    };

    await readStream();
  } catch (error) {
    console.error("Error fetching stream:", error);
  } finally {
    inStream.value = false;

    messages.value.push({
      isUser: false,
      message: res.value,
    });

    nextTick(() => {
      document.querySelectorAll("pre code").forEach((block) => {
        hljs.highlightBlock(block);
      });
    });

    input.value = "";
    rows.value = 1;
    message.value = "";
  }
};

const processMessage = (message) => {
  // Usamos una expresión regular para encontrar bloques de código delimitados por ```
  const codeBlockRegex = /```([\s\S]*?)```/g;

  // Reemplazamos los bloques de código con <pre><code>
  return message.replace(codeBlockRegex, (match, p1) => {
    return `<pre><code>${p1}</code></pre>`;
  });
};
</script>
<template>
  <div class="container mx-auto p-4 min-h-screen flex flex-col">
    <div
      class="bg-[#C73659] border-4 border-[#A91D3A] rounded p-4 mx-auto w-full"
    >
      <h1 class="text-3xl font-semibold text-red-900">ChatBot</h1>
    </div>

    <div class="mt-6 grid grid-cols-4 gap-6 flex-grow">
      <div
        style="height: 84vh"
        class="bg-[#EEEEEE] border-2 border-[#C73659] p-6 rounded-md h-full"
      >
        sidebar
      </div>

      <div
        id="chat"
        style="height: 84vh"
        class="bg-[#EEEEEE] border-2 border-[#C73659] p-6 rounded-md col-span-3 flex flex-col overflow-y-auto justify-between"
      >
        <div class="overflow-y-auto flex-grow">
          <div v-for="msg in messages" :key="msg.message">
            <ProfileUser
              :isUser="msg.isUser"
              :message="processMessage(msg.message)"
              style="white-space: pre-wrap"
            >
            </ProfileUser>
          </div>

          <ProfileUser
            v-if="inStream"
            :isUser="false"
            :message="res"
            style="white-space: pre-wrap"
          />
        </div>

        <div
          :class="`flex bg-gray-300 rounded-md w-full p-2 mt-6
          ${rows === 1 ? 'items-center' : 'items-end'}`"
        >
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
            v-model="message"
            @input="updateRows"
            @keydown="handleKeyDown"
            :rows="rows"
            style="resize: none"
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
      </div>
    </div>
  </div>
</template>

<style scoped></style>
