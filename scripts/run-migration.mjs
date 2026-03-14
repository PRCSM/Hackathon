#!/usr/bin/env node
// Run: DATABASE_URL=... node scripts/run-migration.mjs
// Or just: node scripts/run-migration.mjs (reads from process.env)

import { readFileSync } from 'fs';
import { Pool } from 'pg';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sql = readFileSync(path.join(__dirname, 'migrate.sql'), 'utf8');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function migrate() {
  const client = await pool.connect();
  try {
    console.log('Running migration...');
    await client.query(sql);
    console.log('✅ Migration complete!');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
