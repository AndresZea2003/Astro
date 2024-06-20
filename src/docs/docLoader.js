import { TextLoader } from "langchain/document_loaders/fs/text";

const loader = new TextLoader("src/docs/intro.txt");

const docs = await loader.load();

console.log(docs);