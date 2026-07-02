import express from "express";
import fs from "node:fs";

const todoApp = express();
const port = process.env.PORT || 3000;

todoApp.get("/", async (req, res, next) => {
  await checkTimeStamp();
  next();
});

todoApp.get("/image", (req, res) => {
  res.sendFile("/usr/src/app/project/image.jpg");
});

todoApp.use(express.static("public"));

todoApp.listen(port, () => {
  console.log(`Server started in port ${port}`);
});

const fetchImage = async () => {
  const image = await fetch(process.env.IMAGE_URL);
  const arrayBuffer = await image.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  fs.writeFileSync("/usr/src/app/project/image.jpg", buffer);
};

const checkTimeStamp = async () => {
  try {
    const timeStamp = parseInt(
      fs.readFileSync("/usr/src/app/project/timestamp.txt", "utf-8"),
    );

    if (Date.now() - timeStamp >= 600_000) {
      await fetchImage();
      fs.writeFileSync(
        "/usr/src/app/project/timestamp.txt",
        String(Date.now()),
      );
    }
  } catch (err) {
    console.error(err);
    await fetchImage();
    fs.writeFileSync("/usr/src/app/project/timestamp.txt", String(Date.now()));
  }
};
