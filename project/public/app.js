const urlRegex = /(https?:)?\/\/[^\s]+/g;

const getTodos = async () => {
  const response = await fetch("/todos");
  const todoItems = await response.json();
  return todoItems;
};

const renderTodoList = (todoItems) => {
  const ul = document.querySelector("ul");

  ul.innerHTML = todoItems
    .map((todo) => {
      const linked = todo.todo.replace(
        urlRegex,
        (url) => `<a href="${url}" target="_blank">${url}</a>`,
      );

      const style = todo.done ? 'style="text-decoration: line-through;"' : "";

      const button = todo.done
        ? ""
        : `<button onclick="doneTodo(${todo.id})">Done</button>`;

      return `
        <li ${style}>
          <span>${linked}</span>
          ${button}
        </li>
      `;
    })
    .join("");
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

const doneTodo = async (id) => {
  const response = await fetch(`/todos/${id}`, {
    method: "PUT",
  });

  if (!response.ok) {
    throw new Error("Failed to update TODO");
  }

  await todoList();
};

window.doneTodo = doneTodo;

const breakApp = async () => {
  const response = await fetch("/break", {
    method: "POST",
  });

  if (response.ok) {
    const status = document.querySelector("#status-message");

    status.textContent =
      "Application is broken... Wait for Kubernetes to spin up a new pod...";
    document.querySelector("ul").innerHTML = "";

    const interval = setInterval(async () => {
      try {
        const health = await fetch("/livez");

        if (health.ok) {
          status.textContent = "Application is running normally again!";
          await todoList();

          await new Promise((resolve) => setTimeout(resolve, 2000));

          status.textContent = "";
          clearInterval(interval);
        }
      } catch (err) {
        // Backend may be temporarily unavailable while Kubernetes restarts it
      }
    }, 2000);
  }
};

todoList();
document.querySelector("#create-button").addEventListener("click", handleSend);
document.querySelector("#break-button").addEventListener("click", breakApp);
document.querySelector("input").addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    handleSend();
  }
});
