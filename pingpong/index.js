import express from "express";
import fs from "node:fs";

const pingPong = express();
const port = process.env.PORT || 3000;

pingPong.listen(port, () => {
  console.log(`Server started in port ${port}`);
});

let pongCounter;

try {
  pongCounter = parseInt(
    fs.readFileSync("/usr/src/app/files/ping-file.txt", "utf-8"),
  );
} catch (err) {
  console.error(err);
  pongCounter = 0;
}

pingPong.get("/pingpong", (req, res) => {
  pongCounter++;
  try {
    fs.writeFileSync("/usr/src/app/files/ping-file.txt", String(pongCounter));
  } catch (err) {
    console.error(err);
  }
  res.send(`pong ${pongCounter}`);
});
