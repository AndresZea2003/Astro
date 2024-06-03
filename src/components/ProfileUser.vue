<script setup>
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
        class="bg-gray-400 border-4 border-gray-500 mx-6 p-3 rounded-md shadow-lg"
      >
        {{ props.message }}
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
        class="bg-gray-400 border-4 border-gray-500 mx-6 p-3 rounded-md shadow-lg"
      >
        {{ props.message }}
      </div>
    </div>
  </div>
</template>
