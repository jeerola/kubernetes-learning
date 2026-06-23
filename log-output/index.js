import { randomUUID } from "crypto";
import express from "express";

const logOutput = express();
const port = process.env.PORT || 3000;

logOutput.listen(port, () => {
  console.log(`Server started in port ${port}`);
});

const randomHash = randomUUID();
const getTimeStamp = () => new Date().toISOString();

setInterval(() => {
  console.log(`${getTimeStamp()}: ${randomHash}`);
}, 5000);

logOutput.get("/", (req, res) => {
  res.send(`${getTimeStamp()}: ${randomHash}`);
});
