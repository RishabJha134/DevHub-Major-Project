const express = require("express");
const app = express();

// database connection:-
const { connectDB } = require("./config/database");

const User = require("./models/user");

// middleware is active for all the routes:- convert backend ke andar ka json data jo hum bhej rahe hai usko js object me kar rha hai. json -> js objects and make this readable for in the req.body in every api:-
app.use(express.json());

// dynamic signup routes:-
app.post("/signup", async (req, res) => {
  const { firstName, lastName, emailId, password,gender,age } = req.body;
  console.log(req.body);
  const user = await User({
    firstName: firstName,
    lastName: lastName,
    emailId: emailId,
    password: password,
    gender:gender,
    age:age,
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

// delete a user by id:-
app.delete("/user", async (req, res) => {
  const { _id } = req.body;
  try {
    const deletedUser = await User.findByIdAndDelete({ _id: _id });
    if (deletedUser) {
      res.send("User deleted successfully");
    } else {
      res.status(404).send("No user found with this id");
    }
  } catch (err) {
    console.error("Error deleting user", err.message);
    res.status(500).send("Server Error:" + err.message); // Returning a 500 Internal Server Error.
  }
});

// update a user:-
app.patch("/user", async (req, res) => {
  const { _id } = req.body;
  const data = req.body;

  try {
    const user = await User.findByIdAndUpdate({ _id: _id }, data, {
      returnDocument: "after",
      runValidators:true,
    });
    console.log(user);
  } catch (err) {
    console.error("Error updating user", err.message);
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

// get user by id:-
// app.get("/userbyid", async (req, res) => {
//   const users = await User.findById({_id:req.body._id});
//   console.log(users);
// })

// update by using the email:-
// app.patch("/user", async (req, res) => {
//   const { emailId } = req.body;
//   const data = req.body;
//   try {
//     const user = await User.findOneAndUpdate({ emailId: emailId }, data, {
//       returnDocument: "after",
//     });
//     console.log(user);
//   } catch (err) {
//     console.error("Error updating user", err.message);
//     res.status(500).send("Server Error:" + err.message); // Returning a 500 Internal Server Error.
//   }
// });
