const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("hello world");
});

app.get("/text", (req, res) => {
  res.send("hello world text  path!");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000"); // Log the server is running on port 3000
});
