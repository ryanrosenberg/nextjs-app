import { Database } from "./kysely"; // this is the Database interface we defined earlier
import { Pool } from "pg";
import { PostgresDialect } from "kysely";
import { createKysely } from "@vercel/postgres-kysely";

const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true
  }),
});

// Database interface is passed to Kysely's constructor, and from now on, Kysely
// knows your database structure.
// Dialect is passed to Kysely's constructor, and from now on, Kysely knows how
// to communicate with your database.
export const db = createKysely<Database>();
export { sql } from "kysely";
