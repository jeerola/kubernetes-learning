const express = require("express");

const pingPong = express();
const port = process.env.PORT || 3000;

pingPong.listen(port, () => {
  console.log(`Server started in port ${port}`);
});

let counter = 0;

pingPong.get("/pingpong", (req, res) => {
  counter++;
  res.send(`pong ${counter}`);
});
