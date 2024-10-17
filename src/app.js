const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

// database connection:-
const { connectDB } = require("./config/database");

const User = require("./models/user");
const { validateSignUpData } = require("./utlls/validation");
const { userAuth } = require("./middlewares/auth");

// middleware is active for all the routes:- convert backend ke andar ka json data jo hum bhej rahe hai usko js object me kar rha hai. json -> js objects and make this readable for in the req.body in every api:-
app.use(express.json());

// cookie-parser
app.use(cookieParser()); // Correct initialization

// dynamic signup routes:-
app.post("/signup", async (req, res) => {
  try {
    // step1:- validation:-
    validateSignUpData(req);

    // step2:- password hashing:-
    const { firstName, lastName, emailId, password } = req.body;
    console.log(password);

    const hashedPassword = await bcrypt.hash(password, 11);
    console.log(hashedPassword);

    // step3:- creating a new instance of the User Model
    const user = await User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
    });

    console.log(user);

    await user.save();
    res.send("user added successfully!");
  } catch (err) {
    console.error("Error adding user", err.message);
    res.status(400).send("Server Error:" + err.message); // Returning a 500 Internal Server Error.
  }
});

// login api:-
app.post("/login", async (req, res) => {
  console.log("hello world");
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    console.log(user);
    if (!user) {
      throw new Error("Invalid Credentials!");
    }

    // for validation you need to create diffrent helper custom function only for the email and password
    // validateSignUpData(req);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch);

    if (isMatch) {
      // advance authentication Steps by help of jwt token:-
      // step1:- create a jwt token:-
      const token = await jwt.sign({ _id: user._id }, "secret-key", {
        expiresIn: "7d",
      });
      console.log(token);

      // step2:- set the jwt token inside the cookies and then send back to the server:-
      res.cookie("token", token);
      res.send("Login success!");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send("Error:" + err.message); // Returning a 500 Internal Server Error.
  }
});

// profile api:-
app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;
  console.log("sending the connection request");

  res.send(user.firstName + " sending the connection request");
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

// second method for signup:-
// app.post("/signup", async (req, res) => {
//   const {
//     firstName,
//     lastName,
//     emailId,
//     password,
//     gender,
//     age,
//     photoUrl,
//     about,
//     skills,
//   } = req.body;
//   console.log(req.body);

//   try {

//     const alreadyExist = await User.findOne({ emailId: emailId });

//     if (alreadyExist) {
//       throw new Error("User already exists with this emailId");
//     }

//     const user = await User({
//       firstName: firstName,
//       lastName: lastName,
//       emailId: emailId,
//       password: password,
//       gender: gender,
//       age: age,
//       photoUrl,
//       about,
//       skills,
//     });

//     console.log(user);
//     await user.save();
//     res.send("user added successfully");

//   } catch (err) {
//     console.error("Error adding user", err.message);
//     res.status(400).send("Server Error:" + err.message);
//   }
// });
// find user api:-
// app.get("/user", async (req, res) => {
//   const { emailId } = req.body;

//   try {
//     const users = await User.find({ emailId: emailId });
//     if (users.length == 0) {
//       res.status(404).send("No user found with this emailId");
//     } else {
//       res.send({ users });
//     }
//   } catch (err) {
//     console.error("Error finding user", err.message);
//     res.status(500).send("Server Error:" + err.message); // Returning a 500 Internal Server Error.
//   }
// });

// // feed api:- GET /feed - get all the users from the database.
// app.get("/feed", async (req, res) => {
//   try {
//     const users = await User.find({});
//     res.send({ users });
//   } catch (err) {
//     console.error("Error finding users", err.message);
//     res.status(500).send("Server Error:" + err.message); // Returning a 500 Internal Server Error.
//   }
// });

// // delete a user by id:-
// app.delete("/user", async (req, res) => {
//   const { _id } = req.body;
//   try {
//     const deletedUser = await User.findByIdAndDelete({ _id: _id });
//     if (deletedUser) {
//       res.send("User deleted successfully");
//     } else {
//       res.status(404).send("No user found with this id");
//     }
//   } catch (err) {
//     console.error("Error deleting user", err.message);
//     res.status(500).send("Server Error:" + err.message); // Returning a 500 Internal Server Error.
//   }
// });

// // update a user:-
// app.patch("/user/:userId", async (req, res) => {
//   const _id = req.params.userId;
//   const {
//     firstName,
//     lastName,
//     password,
//     gender,
//     age,
//     photoUrl,
//     about,
//     skills,
//   } = req.body;
//   try {
//     if (skills.length > 11) {
//       throw new Error("skills cannot be more than 11");
//     }

//     const data = {
//       firstName,
//       lastName,
//       password,
//       gender,
//       age,
//       photoUrl,
//       about,
//       skills,
//     };

//     const user = await User.findByIdAndUpdate({ _id: _id }, data, {
//       returnDocument: "after",
//       runValidators: true,
//     });
//     res.send("User updated Successfully:" + user);
//     console.log(user);
//   } catch (err) {
//     console.error("Error updating user", err.message);
//     res.status(500).send("Server Error:" + err.message); // Returning a 500 Internal Server Error.
//   }
// });
