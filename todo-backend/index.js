import express from "express";
import { Pool } from "pg";

const todoBackend = express();
todoBackend.use(express.json());
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

todoBackend.get("/", (req, res) => {
  res.status(200).json({ message: "Server OK" });
})

todoBackend.get("/todos", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM todos;");
    res.json(result.rows.map((row) => row.todo));
  } catch (err) {
    console.error(err);
    return res.status(500).json({error: "Failed to fetch TODO items"});
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

    await client.query("INSERT INTO todos (todo) VALUES ($1)", [newTodoItem]);
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
