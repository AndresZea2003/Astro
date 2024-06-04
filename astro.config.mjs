import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";

import vue from "@astrojs/vue";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), vue()],
  env: {
    PUBLIC_OPENAI_API_KEY: import.meta.env.PUBLIC_OPENAI_API_KEY,
  },
  output: "server",
});