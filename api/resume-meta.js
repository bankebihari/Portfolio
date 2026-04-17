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

function formatFileSize(bytes) {
  return bytes > 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(2)} MB`
    : `${(bytes / 1024).toFixed(1)} KB`;
}

export default async function handler(req, res) {
  try {
    const db = await getDb();
    const doc = await db.collection(COLLECTION_NAME).findOne(
      { _id: RESUME_ID },
      { projection: { data: 0 } }
    );

    if (!doc) return res.status(200).json(null);

    return res.status(200).json({
      url: "/api/resume-file",
      name: doc.name,
      uploadedAt: new Date(doc.uploadedAt).toLocaleDateString(),
      size: formatFileSize(doc.size || 0),
    });
  } catch {
    return res.status(200).json(null);
  }
}
