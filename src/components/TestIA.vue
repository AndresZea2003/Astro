<script setup>
import {ref} from "vue";
import axios from "axios";


const config = ref({
  chatbot: {
    inputText: '',
    res: 'Sin respuesta',
  },
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  }
})



const sendMessage = async () => {
  config.value.chatbot.res = ''; // Clear previous response

  const response = await fetch("/api/llama.json", {
    method: 'POST',
    headers: config.value.headers,
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let done = false;


  while (!done) {
    const { value, done: readerDone } = await reader.read();
    done = readerDone;
    if (value) {
      const chunk = decoder.decode(value, { stream: true });
      const words = chunk.match(/0:"[^"]+"/g); // Extract words
      if (words) {
        words.forEach(word => {
          const cleanWord = word.replace(/0:"|"/g, ''); // Clean up the word
          // console.log(cleanWord); // Access each word here
          config.value.chatbot.res += cleanWord;
        });
      }
    }
  }
  // Trim any extra spaces at the end
  config.value.chatbot.res = config.value.chatbot.res.trim();
};

</script>
<template>

  <div class="flex justify-center items-center h-full w-full">
    <div style="width: 50vmax">
        <h1 class="bg-blue-400 p-4 mt-16">Test IA</h1>
        <div class="bg-amber-50">
          <input class="bg-amber-400" type="text" v-model="config.chatbot.inputText">

          <button class="p-2 border m-2" @click="sendMessage()">Enviar</button>

          <span>{{ config.chatbot.res }}</span>
      </div>
    </div>
  </div>
</template>