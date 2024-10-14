const express = require("express");
const app = express();

// database connection:-
const { connectDB } = require("./config/database");

const User = require("./models/user");

// middleware is active for all the routes:- convert backend ke andar ka json data jo hum bhej rahe hai usko js object me kar rha hai. json -> js objects and make this readable for in the req.body in every api:-
app.use(express.json());

// dynamic signup routes:-
app.post("/signup", async (req, res) => {
  const { firstName, lastName, emailId, password } = req.body;
  console.log(req.body);
  const user = await User({
    firstName: firstName,
    lastName: lastName,
    emailId: emailId,
    password: password,
  });

  console.log(user);

  try {
    await user.save();
    res.send("user added successfully");
  } catch (err) {
    console.error("Error adding user", err.message);
    res.status(400).send("Server Error:" + err.message);
  }
});

// find user api:-
app.get("/user", async (req, res) => {
  const { emailId } = req.body;

  try {
    const users = await User.find({ emailId: emailId });
    if (users.length == 0) {
      res.status(404).send("No user found with this emailId");
    } else {
      res.send({ users });
    }
  } catch (err) {
    console.error("Error finding user", err.message);
    res.status(500).send("Server Error:" + err.message); // Returning a 500 Internal Server Error.
  }
});


// feed api:- GET /feed - get all the users from the database.
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send({ users });
  } catch (err) {
    console.error("Error finding users", err.message);
    res.status(500).send("Server Error:" + err.message); // Returning a 500 Internal Server Error.
  }
});

connectDB();
app.listen(7777, () => {
  console.log("Server is listening on port 7777");
});

// extras:-
// static signup static routes:-
// app.post("/signup", async (req, res) => {
//   // creating a new instance of the User Model.
//   const user = new User({
//     firstName: "Rishab",
//     lastName: "Jha",
//     emailId: "rishab.jha@gmail.com",
//     password: "123456789",
//   });

//   try {
//     await user.save();
//     res.send("User Added successfully!");
//     console.log(user);
//   } catch (err) {
//     console.error("Error adding user:", err);
//     res.status(400).send("Server Error:"+err.message); // Returning a 500 Internal Server Error.
//   }
// });
