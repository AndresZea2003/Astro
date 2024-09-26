import type { APIContext } from "astro";
import { TextLoader } from "langchain/document_loaders/fs/text";

const loader = new TextLoader("src/docs/intro.txt");

import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer";
import {RecursiveCharacterTextSplitter} from "langchain/text_splitter";
import {HtmlToTextTransformer} from "@langchain/community/document_transformers/html_to_text";


import { convert } from "html-to-text";

export async function POST({ request }: APIContext): Promise<Response> {

    const loader = new PuppeteerWebBaseLoader("https://store.lunarclient.com/category/emotes", {
        evaluate: async (page) => {
            // Extrae solo las partes importantes de la documentación
            return await page.evaluate(() => {
                // const relevantSections = document.querySelectorAll('main h1, main h2, main p, main ul, main pre, main li');

                // Lunar
                const relevantSections = document.querySelectorAll('.card.package'); // Selecciona todos los contenedores de tarjetas

                let allEmotesInfo = '';

                relevantSections.forEach(section => {
                    // Obtén el h1 con el nombre del emote
                    const emoteName = section.querySelector('h1').innerText;

                    // Obtén el precio desde el enlace (elemento 'a') que contiene el texto del precio
                    const priceElement = section.querySelector('a.purchase-btn');
                    const price = priceElement ? priceElement.innerText.trim() : 'Precio no disponible';

                    // Muestra el resultado en la consola o lo procesa como desees
                    allEmotesInfo += `( Nombre del emote: ${emoteName} \n - Precio: ${price}\n\n ) ,`;
                });

                return allEmotesInfo.trim();

                /// Lunar


                // let importantContent = '';
                // relevantSections.forEach(section => {
                //     let content = section.textContent.trim();
                //
                //     // Escapar caracteres conflictivos en bloques de código
                //     if (section.tagName === 'PRE' || section.tagName === 'CODE') {
                //         content = content.replace(/{/g, '&#123;').replace(/}/g, '&#125;');
                //         importantContent += `<pre><code>${content}</code></pre>\n\n`;
                //     } else if (section.tagName.startsWith('H')) {
                //         // Conservar etiquetas <h1>, <h2> con sus IDs
                //         const idAttr = section.id ? ` id="${section.id}"` : '';
                //         importantContent += `<${section.tagName.toLowerCase()}${idAttr}>${content}</${section.tagName.toLowerCase()}>\n\n`;
                //     } else {
                //         // Convertir otros elementos a texto plano
                //         importantContent += content + '\n\n';
                //     }
                // });
                //
                // return importantContent.trim();
            });
        },
    });

    const docs = await loader.load();


    let text = convert(docs[0].pageContent)
    // const splitter = RecursiveCharacterTextSplitter.fromLanguage("html");
    // const transformer = new HtmlToTextTransformer();

    text = text.replace(/{/g, '').replace(/}/g, '');
    // const sequence = splitter.pipe(transformer);
    //
    // const newDocuments = await sequence.invoke(docs);

    return new Response(
        JSON.stringify(text), {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        }
    );
}
