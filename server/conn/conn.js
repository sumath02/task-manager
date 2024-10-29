// conn/conn.js
const { Pool } = require("pg");
require("dotenv").config();
const pool = new Pool({
  connectionString: process.env.PG_URI,
});

pool.on("connect", () => {
  console.log("Connected to PostgreSQL database");
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle PostgreSQL client", err);
  process.exit(-1);
});

module.exports = pool;
