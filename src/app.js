const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("hello world");
});

app.get("/test", (req, res) => {
  res.send("hello world test path!");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000"); // Log the server is running on port 3000
});
