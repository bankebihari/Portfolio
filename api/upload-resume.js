import { put, del } from "@vercel/blob";

export const config = { runtime: "edge" };

export default async function handler(req) {
  if (req.method === "DELETE") {
    const { url } = await req.json();
    if (url) await del(url);
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { "Content-Type": "application/json" } });
  }

  if (req.method !== "PUT") {
    return new Response("Method not allowed", { status: 405 });
  }

  const filename = req.headers.get("x-filename") || "resume.pdf";
  const blob = await put(`resume/${filename}`, req.body, {
    access: "public",
    token: process.env.BLOB_READ_WRITE_TOKEN,
    allowOverwrite: true,
  });

  return new Response(JSON.stringify({ url: blob.url, name: filename }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
