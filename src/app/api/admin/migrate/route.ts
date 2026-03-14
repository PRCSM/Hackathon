import { NextResponse } from "next/server";
import { pool } from "@/db";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

export async function GET(req: Request) {
  // Simple security token to avoid accidental runs
  const { searchParams } = new URL(req.url);
  if (searchParams.get("token") !== "padhai-admin-run") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const sqlPath = path.resolve(process.cwd(), "scripts/migrate.sql");
    const sql = readFileSync(sqlPath, "utf8");

    const client = await pool.connect();
    try {
      await client.query(sql);
      return NextResponse.json({ message: "✅ Migration completed successfully!" });
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error("Migration API error:", error);
    return NextResponse.json({ error: "Migration failed", details: error.message }, { status: 500 });
  }
}
