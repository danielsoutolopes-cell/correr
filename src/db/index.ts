import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb() {
  if (dbInstance) return dbInstance;

  if (connectionString) {
    try {
      const pool = new Pool({
        connectionString,
        ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined,
      });
      dbInstance = drizzle(pool, { schema });
      return dbInstance;
    } catch (err) {
      console.warn("[DB] Failed to connect to PostgreSQL:", err);
    }
  }

  return null;
}

export const schemaRef = schema;
