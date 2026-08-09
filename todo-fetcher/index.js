const fetchTodo = async () => {
  try {
    const res = await fetch(process.env.WIKIPEDIA_URL, {
      redirect: "manual",
    });
    const location = res.headers.get("location");
    const newTodo = location.startsWith("//") ? `https:${location}`: location;
    console.log("Fetched URL: ", newTodo);

    const response = await fetch("http://todo-backend:1234/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: `Read ${newTodo}` }),
    });

    console.log("POST status: ", response.status);
  } catch (err) {
    console.error("Error in fetchTodo: ", err);
  }
};

fetchTodo();
