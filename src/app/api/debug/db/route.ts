import { NextResponse } from "next/server";
import { Pool } from "pg";

// GET /api/debug/db — Test direct database connection
export async function GET() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    // Test 1: Basic connection
    const connTest = await pool.query("SELECT NOW() as time");
    
    // Test 2: Check users table schema
    const schema = await pool.query(
      `SELECT column_name, data_type, is_nullable 
       FROM information_schema.columns 
       WHERE table_name = 'users' 
       ORDER BY ordinal_position`
    );

    // Test 3: Check all tables
    const tables = await pool.query(
      `SELECT table_name FROM information_schema.tables 
       WHERE table_schema = 'public' ORDER BY table_name`
    );

    // Test 4: Check approved admins
    const admins = await pool.query("SELECT email FROM approved_admins");

    // Test 5: Try insert and delete a test user (like the adapter would)
    let insertTest = "NOT TESTED";
    try {
      const result = await pool.query(
        `INSERT INTO users (name, email, "emailVerified", image) 
         VALUES ('Test', 'test@test.com', NULL, NULL) 
         RETURNING id, name, email`
      );
      insertTest = JSON.stringify(result.rows[0]);
      // Clean up
      await pool.query("DELETE FROM users WHERE email = 'test@test.com'");
    } catch (e: any) {
      insertTest = `FAILED: ${e.message}`;
    }

    await pool.end();

    return NextResponse.json({
      status: "OK",
      connection: connTest.rows[0],
      userColumns: schema.rows,
      tables: tables.rows.map((r: any) => r.table_name),
      approvedAdmins: admins.rows,
      insertTest,
    });
  } catch (e: any) {
    await pool.end();
    return NextResponse.json({
      status: "ERROR",
      error: e.message,
      stack: e.stack,
    }, { status: 500 });
  }
}
