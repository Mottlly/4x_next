import { Pool } from "pg";

// Validate required environment variables
const requiredEnv = ["DB_USER", "DB_HOST", "DB_NAME", "DB_PASS", "DB_PORT"];
requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing environment variable: ${key}`);
  }
});

const poolConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: Number(process.env.DB_PORT) || 5432,
  ssl: {
    rejectUnauthorized: false,
  },
};

// Ensure a single database pool instance
let pool;
if (!global._pgPool) {
  global._pgPool = new Pool(poolConfig);
  console.log("✅ Database pool initialized");
}

pool = global._pgPool;

// Handle pool errors
pool.on("error", (err) => {
  console.error("Unexpected database error:", err);
});

export default pool;
