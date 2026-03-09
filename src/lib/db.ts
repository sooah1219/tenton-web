import { Pool } from "pg";

declare global {
  var __pgPool: Pool | undefined;
}

export const db =
  global.__pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:
      process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: false }
        : false,
  });

if (process.env.NODE_ENV !== "production") {
  global.__pgPool = db;
}
