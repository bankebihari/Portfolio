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

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  try {
    const db = await getDb();
    const doc = await db.collection(COLLECTION_NAME).findOne({ _id: RESUME_ID });

    if (!doc?.data) return res.status(404).json({ error: "No resume uploaded" });

    // Handle MongoDB Binary type correctly
    let fileBuffer;
    if (Buffer.isBuffer(doc.data)) {
      fileBuffer = doc.data;
    } else if (doc.data?.buffer) {
      fileBuffer = Buffer.from(doc.data.buffer);
    } else {
      fileBuffer = Buffer.from(doc.data);
    }

    res.setHeader("Content-Type", doc.contentType || "application/pdf");
    res.setHeader("Content-Length", fileBuffer.length);
    res.setHeader("Content-Disposition", `inline; filename="${doc.name || "resume.pdf"}"`);
    res.setHeader("Cache-Control", "public, max-age=3600");
    return res.status(200).send(fileBuffer);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
