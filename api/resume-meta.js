import { list } from "@vercel/blob";

export const config = { runtime: "edge" };

export default async function handler() {
  try {
    const { blobs } = await list({
      prefix: "resume/",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    if (!blobs.length) {
      return new Response(JSON.stringify(null), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Return the most recently uploaded resume
    const latest = blobs.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))[0];

    return new Response(
      JSON.stringify({
        url: latest.url,
        name: latest.pathname.replace("resume/", ""),
        uploadedAt: new Date(latest.uploadedAt).toLocaleDateString(),
        size: latest.size > 1024 * 1024
          ? (latest.size / (1024 * 1024)).toFixed(2) + " MB"
          : (latest.size / 1024).toFixed(1) + " KB",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch {
    return new Response(JSON.stringify(null), { status: 200, headers: { "Content-Type": "application/json" } });
  }
}
