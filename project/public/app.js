/**
 * Fetches all todolist items from backend
 * @returns todolist items in JSON format
 */
const getTodos = async () => {
  const response = await fetch("/todos");
  const todoItems = await response.json();
  return todoItems;
};

const renderTodoList = (todoItems) => {
  const ul = document.querySelector("ul");
  ul.innerHTML = todoItems.map((todo) => `<li>${todo}</li>`).join("");
};

const todoList = async () => {
  const todoItems = await getTodos();
  renderTodoList(todoItems);
};

const handleSend = async () => {
  const input = document.querySelector("input");
  const newTodo = input.value;

  await createTodo(newTodo);
  input.value = "";
};

const createTodo = async (newTodo) => {
  await fetch("/todos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: newTodo }),
  });

  todoList(); // refresh the list after creating new TODO
};

todoList();
document.querySelector("button").addEventListener("click", handleSend);
