const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");
const profileRouter = express.Router();
const bcrypt = require("bcrypt");

// profile api:-

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.json({
      message: "your profile has been successfully view",
      data: user,
    });
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("please provide a valid input");
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();
    console.log("logged in user" + loggedInUser);
    res.json({
      message: loggedInUser.firstName + "your profile edit successfully",
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const { password } = req.body;
    console.log(password);
    const inputPassword = await bcrypt.hash(password, 11);
    console.log(inputPassword);
    user.password = inputPassword;
    user.save();
    res.json({ message: "your password edit successfully" });
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
});

module.exports = { profileRouter };
