import express from "express";

const todoBackend = express();
const port = process.env.PORT || 3000;

todoBackend.listen(port, () => {
  console.log(`Server started in port ${port}`);
});

todoBackend.use(express.json());

let todoListItems = [];

todoBackend.get("/todos", (req, res) => {
  try {
    res.json(todoListItems);
  } catch (err) {
    console.error(err);
  }
});

todoBackend.post("/todos", (req, res) => {
  try {
    const newTodoItem = req.body.content;
    todoListItems.push(newTodoItem);
  } catch (err) {
    console.error(err);
  }
  res.status(201).send("New TODO item created successfully");
});
