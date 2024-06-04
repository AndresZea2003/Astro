import type { APIContext } from "astro";
import { Openai } from "../../function/Openai";

export async function GET({
  request,
  url,
  cookies,
}: APIContext): Promise<Response> {
  // return Response.json({
  //   success: true,
  //   result: "Data from Astro Endpoint!",
  // });

  return new Response(
    JSON.stringify({ success: true, result: Openai() }),
    { headers: { "Content-Type": "application/json" } }
  );
}
