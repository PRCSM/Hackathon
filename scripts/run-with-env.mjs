import { loadEnvConfig } from "@next/env";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";
import pkg from "pg";

const { Pool } = pkg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment from .env.local
loadEnvConfig(process.cwd());

const sql = readFileSync(path.join(__dirname, "migrate.sql"), "utf8");
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function migrate() {
  const client = await pool.connect();
  try {
    console.log("Running migration...");
    await client.query(sql);
    console.log("✅ Migration complete!");
  } catch (err) {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
