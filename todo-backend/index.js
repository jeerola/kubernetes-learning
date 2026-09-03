import express from "express";
import { Pool } from "pg";

const todoBackend = express();
todoBackend.use(express.json());
const port = process.env.PORT || 3000;

let isHealthy = true; // used in /livez endpoint

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
});

try {
  await pool.query("CREATE TABLE IF NOT EXISTS todos (todo VARCHAR(140));");
} catch (err) {
  console.error("Database not ready on startup");
}

todoBackend.listen(port, () => {
  console.log(`Server started in port ${port}`);
});

todoBackend.get("/", (req, res) => {
  res.status(200).json({ message: "Server OK" });
});

todoBackend.get("/todos", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM todos;");
    res.json(result.rows.map((row) => row.todo));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch TODO items" });
  }
});

todoBackend.post("/todos", async (req, res) => {
  try {
    const newTodoItem = req.body.content?.trim();

    if (!newTodoItem || newTodoItem.trim().length === 0) {
      return res.status(400).send("TODO cannot be empty");
    }

    if (newTodoItem.length > 140) {
      console.log(`TODO rejected: ${newTodoItem}`);
      return res.status(400).send("Too long TODO item");
    }

    await pool.query("INSERT INTO todos (todo) VALUES ($1)", [newTodoItem]);
    console.log(`${new Date().toISOString()} - New TODO: ${newTodoItem}`);
    res.status(201).json({
      message: "New TODO item created successfully",
      todo: newTodoItem,
    });
  } catch (err) {
    console.error(`${new Date().toISOString()}`, err);
    return res.status(500).send("Failed to create TODO item");
  }
});

todoBackend.get("/livez", (req, res) => {
  if (!isHealthy) {
    return res.status(500).json({ status: "unhealthy" });
  }

  return res.status(200).json({ status: "healthy" });
});

todoBackend.get("/healthz", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.status(200).send();
  } catch (err) {
    res.status(503).json({ error: "Database service not ready" });
  }
});

todoBackend.post("/break", (req, res) => {
  isHealthy = false;
  res.status(200).json({ status: "broken" });
});
