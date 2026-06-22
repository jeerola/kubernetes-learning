const express = require("express");

const todoApp = express();
const port = process.env.PORT || 3000;

todoApp.use(express.static("public"));

todoApp.listen(port, () => {
  console.log(`Server started in port ${port}`);
});
