import { Pool } from "pg";

// Ensure environment variables are loaded
if (!process.env.DB_USER || !process.env.DB_HOST) {
  throw new Error("Missing database environment variables!");
}

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
});

// Singleton pattern to prevent multiple connections
if (!global.pgPool) {
  global.pgPool = pool;
}

export default global.pgPool;
