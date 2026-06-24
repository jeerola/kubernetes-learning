import express from "express";
import fs from "node:fs";

const logOutput = express();
const port = process.env.PORT || 3000;

logOutput.listen(port, () => {
  console.log(`Server started in port ${port}`);
});

logOutput.get("/", (req, res) => {
  try {
    const hashContent = fs.readFileSync(
      "/usr/src/app/files/hash-file.txt",
      "utf-8",
    );
    const pingContent = fs.readFileSync(
      "/usr/src/app/files/ping-file.txt",
      "utf-8",
    );
    res.status(200).send(`${hashContent} \n Ping / Pongs: ${pingContent}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("File not available");
  }
});
