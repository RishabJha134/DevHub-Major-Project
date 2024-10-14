const express = require("express");
const app = express();

// database connection:-
const { connectDB } = require("./config/database");

const User = require("./models/user");

app.post("/signup", async (req, res) => {
  // creating a new instance of the User Model.
  const user = new User({
    firstName: "Rishab",
    lastName: "Jha",
    emailId: "rishab.jha@gmail.com",
    password: "123456789",
  });

  try {
    await user.save();
    res.send("User Added successfully!");
    console.log(user);
  } catch (err) {
    console.error("Error adding user:", err);
    res.status(400).send("Server Error:"+err.message); // Returning a 500 Internal Server Error.
  }
});

connectDB();
app.listen(7777, () => { 
  console.log("Server is listening on port 7777");
});
