import type { APIContext } from "astro";
import type { APIRoute } from "astro";

import { TextLoader } from "langchain/document_loaders/fs/text";

const loader = new TextLoader("src/docs/intro.txt");

const reader = await loader.load();

export const POST: APIRoute = ({ request }) => {
  return new Response(JSON.stringify({
      reader
    })
  )
}
