import { Database } from "./kysely"; // this is the Database interface we defined earlier
import { Pool } from "pg";
import { PostgresDialect } from "kysely";
import { createKysely } from "@vercel/postgres-kysely";

const dialect = new PostgresDialect({
  pool: new Pool({
    database: "verceldb",
    host: "ep-orange-wind-33988347-pooler.us-east-1.postgres.vercel-storage.com",
    user: "default",
    password: "Q4joftsWb3kZ",
    port: 5432,
  }),
});

// Database interface is passed to Kysely's constructor, and from now on, Kysely
// knows your database structure.
// Dialect is passed to Kysely's constructor, and from now on, Kysely knows how
// to communicate with your database.
export const db = createKysely<Database>();
export { sql } from "kysely";
