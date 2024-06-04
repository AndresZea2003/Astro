import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ params, request}) => {
  return Response.json({
    success: true,
    result: 'API EPICARDA'
  });
  return {
    status: 200,
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
        "name": "John Doe",
        "age": 25
    })
  };
}