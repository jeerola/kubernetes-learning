import express from "express";
import fs from "node:fs";
import { Pool } from "pg";

const pingPong = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
});

pingPong.listen(port, () => {
  console.log(`Server started in port ${port}`);
});

let client;

try {
  client = await pool.connect();

  await client.query("CREATE TABLE IF NOT EXISTS counter (pong INT);");

  await client.query(
    "INSERT INTO counter (pong) SELECT 0 WHERE NOT EXISTS (SELECT 1 FROM counter);",
  );
} catch (err) {
  console.error("Database not ready on startup");
} finally {
  if (client) {
    client.release();
  }
}

pingPong.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "UPDATE counter SET pong = pong + 1 RETURNING pong",
    );
    res.status(200).send(`pong ${result.rows[0].pong}`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

pingPong.get("/pings", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM counter");
    res.send(`${result.rows[0].pong}`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

pingPong.get("/healthz", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.status(200).send();
  } catch (err) {
    res.status(503).json({ error: "Database service not ready" });
  }
});
