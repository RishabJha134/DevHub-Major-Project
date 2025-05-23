const express = require("express");
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const { User } = require("../models/user");
const authRouter = express.Router();
const jwt = require("jsonwebtoken");

// dynamic signup routes:-
authRouter.post("/signup", async (req, res) => {
  console.log("hello i am from signup in auth.js");
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

    const savedUser = await user.save();
    console.log("saved user from auth.js" + savedUser);
    const token = await savedUser.getJWT();

    // step2:- set the jwt token inside the cookies and then send back to the server:-
    // step2:- set the jwt token inside the cookies and then send back to the server:-
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000), // 8 hours from now
      httpOnly: true,
      secure: true, // Always use secure with cross-domain setup
      sameSite: "none", // Critical for cross-domain cookies
      path: "/",
    });

    res.json({ message: "user saved successfully", data: savedUser });
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
      // step2:- set the jwt token inside the cookies and then send back to the server:-
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000), // 8 hours from now
        httpOnly: true,
        secure: true, // Always use secure with cross-domain setup
        sameSite: "none", // Critical for cross-domain cookies
        path: "/",
      });
      // res.json("Login success!", user);
      res.json({
        message: "Login success",
        data: user,
      });
    } else {
      // throw new Error("Invalid Credentials");
      return res.status(401).json({
        message: "Invalid Credentials",
        error: err.message,
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: "Invalid Credentials",
      error: err.message,
    });
  }
});

// logout api:-
authRouter.post("/logout", async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/", // must match the path used when cookie was set
  });

  res.json({ message: "Logged out successfully!" });
});

module.exports = { authRouter };
