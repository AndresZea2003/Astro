<script setup>
import hljs from "highlight.js";
import "highlight.js/styles/default.css";
import { defineProps, onMounted, nextTick, ref, watchEffect } from "vue";

const props = defineProps({
  isUser: {
    type: Boolean,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

let processedMessage = ref(props.message);

const highlightCode = async () => {
  console.log(typeof document !== "undefined");
  if (typeof document !== "undefined") {
    await nextTick();
    document.querySelectorAll("pre code").forEach((block) => {
      hljs.highlightBlock(block);
    });
  }
};

onMounted(highlightCode);

watchEffect(() => {
  processedMessage.value = props.message;
  highlightCode();
});
</script>

<template>
  <div class="mx-4 pb-2">
    <div
      v-if="props.isUser"
      :class="`w-full flex items-center ${
        props.isUser ? 'justify-end' : 'justify-start'
      }`"
    >
      <div
        style="max-width: 60%; word-wrap: break-word; overflow-wrap: break-word"
        class="bg-gray-400 border-4 border-gray-500 mx-6 p-3 rounded-md shadow-lg"
      >
        <div>
          <template v-if="processedMessage.includes('<pre><code>')">
            <pre
              style="white-space: pre-wrap; word-break: break-word"
              v-html="processedMessage"
            ></pre>
          </template>

          <template v-else>
            <p style="white-space: pre-wrap; word-break: break-word">
              {{ props.message }}
            </p>
          </template>
        </div>
      </div>
      <div
        style="
          width: 60px;
          height: 60px;
          min-width: 60px;
          max-width: 60px;
          min-height: 60px;
          max-height: 60px;
        "
        class="bg-blue-800 rounded-full"
      ></div>
    </div>

    <div
      v-else
      :class="`w-full flex items-center ${
        props.isUser ? 'justify-end' : 'justify-start'
      }`"
    >
      <div
        style="
          width: 60px;
          height: 60px;
          min-width: 60px;
          max-width: 60px;
          min-height: 60px;
          max-height: 60px;
        "
        class="bg-red-800 rounded-full"
      ></div>
      <div
        style="max-width: 60%; word-wrap: break-word; overflow-wrap: break-word"
        class="bg-gray-400 border-4 border-gray-500 mx-6 p-3 rounded-md shadow-lg"
      >
        <div>
          <template v-if="processedMessage.includes('<pre><code>')">
            <pre
              style="white-space: pre-wrap; word-break: break-word"
              v-html="processedMessage"
            ></pre>
          </template>

          <template v-else>
            <p style="white-space: pre-wrap; word-break: break-word">
              {{ props.message }}
            </p>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
