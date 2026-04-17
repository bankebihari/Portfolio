import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const DB_NAME = "portfolio";

let cachedClient = null;

async function getDb() {
  if (cachedClient) return cachedClient.db(DB_NAME);
  const client = new MongoClient(uri);
  await client.connect();
  cachedClient = client;
  return client.db(DB_NAME);
}

const DEFAULT_ID = "hellobro1206";
const DEFAULT_PASS = "hello@123321";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { id, password, action, newId, newPass } = req.body || {};

    const db = await getDb();
    const doc = await db.collection("config").findOne({ _id: "admin" });

    const storedId = doc?.id || DEFAULT_ID;
    const storedPass = doc?.password || DEFAULT_PASS;

    // Validate current credentials first
    if (id !== storedId || password !== storedPass) {
      return res.status(401).json({ ok: false, error: "Invalid ID or password." });
    }

    // Update credentials action
    if (action === "update") {
      if (!newId?.trim() || !newPass?.trim()) {
        return res.status(400).json({ ok: false, error: "New ID and password required." });
      }
      await db.collection("config").updateOne(
        { _id: "admin" },
        { $set: { id: newId.trim(), password: newPass.trim() } },
        { upsert: true }
      );
      return res.status(200).json({ ok: true, message: "Credentials updated." });
    }

    // Just validate
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
