import { Pool } from "pg";
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_URL,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD?.toString(),
  port: parseInt(process.env.DB_PORT!),
});

export default pool;
