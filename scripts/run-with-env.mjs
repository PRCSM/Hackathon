import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";
import pkg from "pg";

const { Pool } = pkg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment from .env.local manually to avoid dependency issues
const envFile = path.resolve(process.cwd(), ".env.local");
const envContent = readFileSync(envFile, "utf8");
let dbUrl = "";

for (const line of envContent.split("\n")) {
  if (line.trim().startsWith("DATABASE_URL=")) {
    dbUrl = line.split("=").slice(1).join("=").trim().replace(/['"]/g, "");
    break;
  }
}

if (!dbUrl) {
  console.error("❌ DATABASE_URL not found in .env.local");
  process.exit(1);
}

process.env.DATABASE_URL = dbUrl;
const sql = readFileSync(path.join(__dirname, "migrate.sql"), "utf8");
const pool = new Pool({ connectionString: dbUrl });

async function migrate() {
  const client = await pool.connect();
  try {
    console.log("Running migration on URL:", dbUrl.split("@")[1]); // Safe log
    await client.query(sql);
    console.log("✅ Migration complete!");
  } catch (err) {
    console.error("❌ Migration failed:", err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
