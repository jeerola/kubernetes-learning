import { randomUUID } from "crypto";

const randomHash = randomUUID();

setInterval(() => {
  console.log(`${new Date().toISOString()}: ${randomHash}`);
}, 5000);
