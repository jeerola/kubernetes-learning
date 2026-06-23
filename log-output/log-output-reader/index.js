import express from "express";
import fs from "node:fs";

const logOutput = express();
const port = process.env.PORT || 3000;

logOutput.listen(port, () => {
  console.log(`Server started in port ${port}`);
});

logOutput.get("/", (req, res) => {
  try {
    const fileContent = fs.readFileSync(
      "/usr/src/app/files/hashOutput.txt",
      "utf-8",
    );
    res.status(200).send(`${fileContent}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("File not available")
  }
});
