const express = require("express");
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const { User } = require("../models/user");
const authRouter = express.Router();

// dynamic signup routes:-
authRouter.post("/signup", async (req, res) => {
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
authRouter.post("/login", async (req, res) => {
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

    const isMatch = await user.validatePassword(password);
    console.log(isMatch);

    if (isMatch) {
      // advance authentication Steps by help of jwt token:-
      // step1:- create a jwt token:-
      // const token = await jwt.sign({ _id: user._id }, "secret-key", {
      //   expiresIn: "7d",
      // });
      // console.log(token);

      // 2nd method for creating a jwt token:-

      const token = await user.getJWT();
      console.log(token);

      // step2:- set the jwt token inside the cookies and then send back to the server:-
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      // res.json("Login success!", user);
      res.json({
        
        message: "Login success",
        data: user,
      });
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send("Error:" + err.message); // Returning a 500 Internal Server Error.
  }
});

// logout api:-
authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("Logged out successfully!");
});

module.exports = { authRouter };
