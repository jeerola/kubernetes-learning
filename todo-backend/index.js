import express from "express";
import { Pool } from "pg";

const todoBackend = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
});

const client = await pool.connect();
await client.query("CREATE TABLE IF NOT EXISTS todos (todo VARCHAR(140));");

todoBackend.listen(port, () => {
  console.log(`Server started in port ${port}`);
});

todoBackend.use(express.json());

todoBackend.get("/todos", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM todos;");
    res.json(result.rows.map(row => row.todo));
  } catch (err) {
    console.error(err);
  }
});

todoBackend.post("/todos", async (req, res) => {
  try {
    const newTodoItem = req.body.content;
    await client.query("INSERT INTO todos (todo) VALUES ($1)", [newTodoItem]);
  } catch (err) {
    console.error(err);
  }
  res.status(201).send("New TODO item created successfully");
});
