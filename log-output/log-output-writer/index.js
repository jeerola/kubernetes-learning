import { randomUUID } from "crypto";
import fs from "node:fs";

const randomHash = randomUUID();
const getTimeStamp = () => new Date().toISOString();

setInterval(() => {
  try {
    const fileContent = `${getTimeStamp()}: ${randomHash}`;
    fs.writeFileSync("/usr/src/app/files/hash-file.txt", fileContent);
  } catch (err) {
    console.error(err);
  }
}, 5000);
