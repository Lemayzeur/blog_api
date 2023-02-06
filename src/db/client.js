import "dotenv/config.js";
import pkg from "pg";
const { Pool, Client } = pkg;

export const dbConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
};

export const pool = new Pool(dbConfig);

const client = new Client(dbConfig);

export default client;
