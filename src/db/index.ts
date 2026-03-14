import { Pool } from "pg";
import { Kysely, PostgresDialect } from "kysely";
import type { Database } from "./types";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
});

export const db = new Kysely<Database>({
  dialect: new PostgresDialect({ pool }),
});

export { pool };
export type { Database };
