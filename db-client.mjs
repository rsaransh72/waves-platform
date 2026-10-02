import { config } from "dotenv";
import { Client } from "pg";

config({ path: ".env.local" });

const connectionString = process.env.DATABASE_URL;

export function createDatabaseClient() {
  if (!connectionString) {
    throw new Error("DATABASE_URL must be configured in the environment or .env.local");
  }

  return new Client({ connectionString });
}