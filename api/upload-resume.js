import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const DB_NAME = "portfolio";
const COLLECTION_NAME = "resumeFiles";
const RESUME_ID = "latest";

let cachedClient = null;

async function getDb() {
  if (cachedClient) return cachedClient.db(DB_NAME);
  const client = new MongoClient(uri);
  await client.connect();
  cachedClient = client;
  return client.db(DB_NAME);
}

async function readRequestBuffer(req) {
  const chunks = [];

  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    try {
      const db = await getDb();
      await db.collection(COLLECTION_NAME).deleteOne({ _id: RESUME_ID });
      return res.status(200).json({ ok: true });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const filename = req.headers["x-filename"] || "resume.pdf";
    const contentType = req.headers["content-type"] || "application/pdf";
    const fileBuffer = await readRequestBuffer(req);

    if (!fileBuffer.length) {
      return res.status(400).json({ error: "Uploaded file is empty" });
    }

    const db = await getDb();
    await db.collection(COLLECTION_NAME).replaceOne(
      { _id: RESUME_ID },
      {
        _id: RESUME_ID,
        name: filename,
        contentType,
        size: fileBuffer.length,
        uploadedAt: new Date(),
        data: fileBuffer,
      },
      { upsert: true }
    );

    return res.status(200).json({ url: "/api/resume-file", name: filename });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

export const config = {
  api: {
    bodyParser: false,
    sizeLimit: "10mb",
  },
};
