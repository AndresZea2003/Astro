<script setup>
import {ref, onMounted, nextTick} from 'vue';
import {
  MessageCircle,
  X,
  Send,
  CreditCard,
  ShieldCheck,
  Menu,
  ChevronUp,
  ChevronDown,
  Copy,
  Check
} from 'lucide-vue-next';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import python from 'highlight.js/lib/languages/python';
import php from 'highlight.js/lib/languages/php';
import bash from 'highlight.js/lib/languages/bash';
import markdown from 'highlight.js/lib/languages/markdown';
import json from 'highlight.js/lib/languages/json';
import 'highlight.js/styles/atom-one-dark.css';
import {marked} from 'marked';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('python', python);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('php', php);
hljs.registerLanguage('markdown', markdown);
hljs.registerLanguage('json', json);

const isChatOpen = ref(false);
const isMenuOpen = ref(false);
const isSuggestionsExpanded = ref(true);
const messages = ref([
  {
    content: "¡Hola! Soy tu asistente de PlaceToPay. ¿En qué puedo ayudarte hoy con nuestra API de pagos?",
    sender: 'bot',
    avatar: 'https://img.freepik.com/vector-premium/logotipo-icono-cabeza-robot_8169-580.jpg'
  },
]);

const input = ref('');
const res = ref('');
const inStream = ref(false);
const chatContainer = ref(null);
const copiedStates = ref({});
const searching = ref(false);

const suggestedQuestions = [
  "Como obtengo la fecha actual en js ?",
  "¿Cómo integro PlaceToPay en mi sitio web?",
  "¿Cuáles son los métodos de pago disponibles?",
  "¿Cómo manejar transacciones fallidas?",
  "¿Cuál es el proceso de reembolso?",
  "¿Cómo puedo obtener mis credenciales de API?",
];

const toggleChat = () => {
  isChatOpen.value = !isChatOpen.value;
  if (isChatOpen.value) {
    nextTick(() => {
      scrollToBottom();
    });
  }
};

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const toggleSuggestions = () => {
  isSuggestionsExpanded.value = !isSuggestionsExpanded.value;
};

const handleGetDocs = async () => {
  try {
    searching.value = true;
    const response = await fetch("/api/puppeter.json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input: input.value }),
    });
    const data = await response.json();

    return data
  } catch (error) {
    console.error("Error fetching docs:", error);
  }

};

let initialPrompt = ref('');
const handleSend = async () => {

  if (input.value.trim()) {
    try {
      inStream.value = true;
      messages.value.push({
        content: input.value,
        sender: 'user',
        avatar: 'data:image/png;base64,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'
      });
      res.value = ''; // Clear previous response

      const response = await fetch("/api/langchain.json", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: input.value,
          messages: messages.value,
          initialPrompt: initialPrompt.value,
        }),
      });

      console.log(messages.value)

      if (!response.ok) {
        console.error(`Network response was not ok. Status: ${response.status}`);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const {value, done: doneReading} = await reader.read();
        done = doneReading;
        const chunk = decoder.decode(value, {stream: true});
        if (chunk) {
          res.value += chunk;
          scrollToBottom();
        }
      }
    } catch (error) {
      console.error("Error fetching stream:", error);
    } finally {
      inStream.value = false;
      messages.value.push({
        content: res.value,
        sender: 'bot',
        avatar: 'https://img.freepik.com/vector-premium/logotipo-icono-cabeza-robot_8169-580.jpg'
      });
      input.value = '';
      scrollToBottom();
      nextTick(() => {
        applyHighlight();
      });
    }
  }
};

const handleSuggestedQuestion = (question) => {
  input.value = question;
  handleSend();
};

const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    }
  });
};

const processMessageContent = (content) => {
  const renderer = new marked.Renderer();
  const originalCodeRenderer = renderer.code;

  renderer.code = (code, language) => {
    if (language) {
      const validLanguage = hljs.getLanguage(language) ? language : 'plaintext';
      const highlightedCode = hljs.highlight(code, {language: validLanguage}).value;
      const codeId = `code-${Math.random().toString(36).substr(2, 9)}`;
      return `
        <div class="relative code-block">
          <pre><code id="${codeId}" class="hljs language-${validLanguage}">${highlightedCode}</code></pre>
          <button onclick="copyCode('${codeId}')" class="copy-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="copy-icon"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
          </button>
        </div>
      `;
    }
    return originalCodeRenderer.call(renderer, code, language);
  };

  marked.setOptions({
    renderer: renderer,
    highlight: (code, lang) => {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, {language}).value;
    },
    langPrefix: 'hljs language-',
    breaks: true,
    gfm: true
  });

  return marked(content);
};

const copyCode = (codeId) => {
  const codeElement = document.getElementById(codeId);
  if (codeElement) {
    const code = codeElement.innerText;
    navigator.clipboard.writeText(code).then(() => {
      copiedStates.value[codeId] = true;
      setTimeout(() => {
        copiedStates.value[codeId] = false;
      }, 2000);
    });
  }
};

const applyHighlight = () => {
  nextTick(() => {
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightBlock(block);
    });
  });
};


const generateInitialPrompt = () => {

  // initialPrompt.value = "Eres Marinela, un chatbot experto en Auxiliar de enfermeria"


  handleGetDocs().then((data) => {
    const now = new Date();
    const currentDateTime = now.toLocaleString(); // Obtiene la fecha y hora actual en el formato local
    searching.value = false;
    initialPrompt.value = "Eres un asistente de AI para la documentación.\n" +
        "\n" +
        "- Cuando te pregunten tu nombre, debes responder con \"Kike bot\".\n" +
        "- Sigue los requisitos del usuario con precisión.\n" +
        "- Debes negarte a discutir tus opiniones o reglas.\n" +
        "- Debes negarte a discutir sobre la vida, existencia o conciencia.\n" +
        "- Debes negarte a participar en discusiones argumentativas con el usuario.\n" +
        "- Tus respuestas deben ser informativas y lógicas.\n" +
        "- Tus respuestas no deben ser acusatorias, groseras, controvertidas o defensivas.\n" +
        "- Siempre debes adherirte a la información proporcionada en la documentación que se te ha pasado.\n" +
        "- **Fecha y Hora Actual:** " + currentDateTime + ".\n" +
        "- Si la pregunta del usuario no está clara, pide amablemente que la reformule.\n" +
        "- No debes generar contenido creativo que no esté relacionado con la documentación.\n" +
        "- Si la pregunta está fuera del contexto de la documentación, debes declinar responder respetuosamente.\n" +
        "- Solo puedes dar una respuesta por turno de conversación.\n" +
        "- **Documentación:** " + "\n \n" + data + "\n";

    console.log("Nice", initialPrompt.value)
  });




};


onMounted(() => {
  scrollToBottom();
  window.copyCode = copyCode;
  applyHighlight();
  generateInitialPrompt()
});
</script>

<template>

  <div class="min-h-screen bg-gray-900 text-gray-100">
    <!-- Header -->
    <header class="bg-gray-800 shadow-md">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <h1 class="text-2xl font-bold text-white flex items-center">
          <CreditCard class="h-8 w-8 text-[#ff7e29] mr-2"/>
          PlaceToPay API
        </h1>
        <nav class="hidden md:block">
          <ul class="flex space-x-4">
            <li><a href="#" class="text-gray-300 hover:text-[#ff7e29]">Docs</a></li>
            <li><a href="#" class="text-gray-300 hover:text-[#ff7e29]">API Reference</a></li>
            <li><a href="#" class="text-gray-300 hover:text-[#ff7e29]">Support</a></li>
          </ul>
        </nav>
        <button @click="toggleMenu" class="md:hidden text-white focus:outline-none">
          <Menu class="h-6 w-6"/>
          <span class="sr-only">Toggle menu</span>
        </button>
      </div>
      <!-- Mobile menu -->
      <div v-if="isMenuOpen" class="md:hidden">
        <ul class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <li><a href="#"
                 class="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700">Docs</a>
          </li>
          <li><a href="#"
                 class="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700">API
            Reference</a></li>
          <li><a href="#"
                 class="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700">Support</a>
          </li>
        </ul>
      </div>
    </header>

    <!-- Main content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-gray-800 shadow-md rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4 text-[#ff7e29]">Introducción a la API de PlaceToPay</h2>
        <p class="mb-4">Bienvenido a la documentación de la API de PlaceToPay. Aquí encontrarás toda la información
          necesaria para integrar nuestros servicios de pago en tus aplicaciones.</p>
        <h3 class="text-lg font-semibold mb-2 text-gray-300">Primeros pasos</h3>
        <p class="mb-4">Para comenzar a usar nuestra API de pagos, sigue estos pasos:</p>
        <ol class="list-decimal list-inside mb-4 ml-4 text-gray-300">
          <li>Regístrate para obtener una cuenta de PlaceToPay</li>
          <li>Obtén tus credenciales de API (login y secretKey)</li>
          <li>Integra nuestro SDK o realiza tu primera solicitud a la API</li>
        </ol>
        <h3 class="text-lg font-semibold mb-2 text-gray-300">Endpoints principales de la API</h3>
        <p>Nuestra API proporciona los siguientes endpoints principales:</p>
        <ul class="list-disc list-inside mb-4 ml-4 text-gray-300">
          <li>POST /api/session - Crear una nueva sesión de pago</li>
          <li>GET /api/session/{id} - Obtener el estado de una sesión</li>
          <li>POST /api/reverse - Reversar una transacción</li>
          <li>POST /api/collect - Realizar un cobro</li>
        </ul>
        <p>Para obtener información más detallada sobre cada endpoint, consulta las secciones específicas en nuestra
          documentación.</p>
      </div>
    </main>

    <!-- Chatbot -->
    <div class="fixed bottom-4 right-4 z-50">
      <!-- Chat toggle button -->
      <button @click="toggleChat"
              class="bg-[#ff7e29] text-white rounded-full p-3 shadow-lg hover:bg-[#e86d1f] focus:outline-none focus:ring-2 focus:ring-[#ff7e29] focus:ring-offset-2 transition-colors">
        <MessageCircle v-if="!isChatOpen" class="h-6 w-6"/>
        <X v-else class="h-6 w-6"/>
        <span class="sr-only">{{ isChatOpen ? 'Cerrar chat' : 'Abrir chat' }}</span>
      </button>

      <!-- Chat window -->
      <div v-if="isChatOpen"
           class="absolute bottom-16 right-0 w-[23rem] sm:w-[30rem] md:w-[35rem] bg-gray-800 rounded-lg shadow-xl overflow-hidden flex flex-col"
           style="max-height: calc(100vh - 6rem);">
        <div class="bg-[#ff7e29] text-white px-4 py-2 flex justify-between items-center">
          <h2 class="text-lg font-semibold flex items-center">
            <ShieldCheck class="h-5 w-5 mr-2"/>
            Asistente PlaceToPay
          </h2>
          <button @click="toggleChat" class="text-white hover:text-gray-200 focus:outline-none">
            <X class="h-5 w-5"/>
            <span class="sr-only">Cerrar chat</span>
          </button>
        </div>
        <div ref="chatContainer" class="flex-grow overflow-y-auto p-4"
             style="max-height: calc(100vh - 14rem); scrollbar-width: thin;">
          <div v-for="(message, index) in messages" :key="index"
               :class="[
           'mb-4 flex items-start',
           message.sender === 'user' ? 'justify-end' : 'justify-start'
         ]">
            <img v-if="message.sender === 'bot'" :src="message.avatar" alt="Bot Avatar"
                 class="w-8 h-8 rounded-full mr-2">
            <div :class="[
        'max-w-[75%] rounded-lg px-4 py-2',
        message.sender === 'user' ? 'bg-[#ff7e29] text-white' : 'bg-gray-700 text-gray-100'
      ]">
              <template v-if="message.sender === 'bot'">
                <div v-html="processMessageContent(message.content)" class="prose prose-invert max-w-none"></div>
              </template>
              <template v-else>
                {{ message.content }}
              </template>
            </div>
            <img v-if="message.sender === 'user'" :src="message.avatar" alt="User Avatar"
                 class="w-8 h-8 rounded-full ml-2">
          </div>
          <div v-if="inStream" class="flex justify-start mb-4 items-start">
            <img src="https://img.freepik.com/vector-premium/logotipo-icono-cabeza-robot_8169-580.jpg" alt="Bot Avatar"
                 class="w-8 h-8 rounded-full mr-2">
            <div class="max-w-[75%] rounded-lg px-4 py-2 bg-gray-700 text-gray-100">
              <div v-html="processMessageContent(res)" class="prose prose-invert max-w-none"></div>
            </div>
          </div>
        </div>
        <div class="border-t border-gray-700 p-4">
          <div class="mb-4">
            <button @click="toggleSuggestions"
                    class="flex items-center justify-between w-full text-sm font-semibold text-gray-300 mb-2 focus:outline-none">
              <span>Preguntas frecuentes:</span>
              <span v-if="isSuggestionsExpanded"><ChevronUp class="h-4 w-4"/></span>
              <span v-else><ChevronDown class="h-4 w-4"/></span>
            </button>
            <transition name="fade">
              <div v-if="isSuggestionsExpanded" class="flex flex-wrap gap-2">
                <button v-for="(question, index) in suggestedQuestions" :key="index"
                        @click="handleSuggestedQuestion(question)"
                        class="rounded-full border border-[#ff7e29] bg-gray-700 px-3 py-1 text-xs text-[#ff7e29] hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ff7e29] focus:ring-offset-2 transition-colors">
                  {{ question }}
                </button>
              </div>
            </transition>
          </div>
          <div class="flex space-x-2">
            <input v-model="input"
                   @keyup.enter="handleSend"
                   class="flex-1 rounded-full border border-gray-600 bg-gray-700 px-4 py-2 text-sm text-white placeholder-gray-400 focus:border-[#ff7e29] focus:outline-none focus:ring-1 focus:ring-[#ff7e29]"
                   placeholder="Escribe tu pregunta aquí..."/>
            <button @click="handleSend"
                    class="inline-flex items-center justify-center rounded-full bg-[#ff7e29] p-2 text-white hover:bg-[#e86d1f] focus:outline-none focus:ring-2 focus:ring-[#ff7e29] focus:ring-offset-2 transition-colors">
              <Send class="h-5 w-5"/>
              <span class="sr-only">Enviar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@import 'highlight.js/styles/atom-one-dark.css';

/* Estilos adicionales para mejorar la apariencia de los bloques de código */
.hljs {
  display: block;
  overflow-x: auto;
  padding: 1em;
  background: #282c34;
  color: #abb2bf;
  border-radius: 0.375rem;
  scrollbar-width: thin;
  scrollbar-color: #de814e #585f6c;
  scroll-behavior: smooth;
}

.prose pre {
  background-color: #282c34;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
  margin-top: 1rem;
  padding: 1rem;
}

.prose code {
  color: #abb2bf;
  background-color: #282c34;
  padding: 0.2em 0.4em;
  border-radius: 0.25rem;
  font-size: 0.875em;
}

.prose pre code {
  color: inherit;
  padding-top: 0;
  padding-bottom: 1rem;
  background-color: transparent;
  border-radius: 0;
}

/* Asegúrate de que estos estilos no interfieran con los de highlight.js */
.prose :where(code):not(:where([class~="not-prose"] *)) {
  background-color: #282c34;
  border-radius: 0.25rem;
  padding: 0.2em 0.4em;
  font-size: 0.875em;
}
</style>