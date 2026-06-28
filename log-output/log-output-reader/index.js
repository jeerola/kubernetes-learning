import express from "express";
import fs from "node:fs";

const logOutput = express();
const port = process.env.PORT || 3000;

logOutput.listen(port, () => {
  console.log(`Server started in port ${port}`);
});

logOutput.get("/", async (req, res) => {
  try {

    const hashContent = fs.readFileSync(
      "/usr/src/app/files/hash-file.txt",
      "utf-8",
    );

    const pingContent = await fetch("http://pingpong:3456/pings")
    const pings = await pingContent.text();

    res.status(200).send(`${hashContent} \n Ping / Pongs: ${pings}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("File not available");
  }
});
