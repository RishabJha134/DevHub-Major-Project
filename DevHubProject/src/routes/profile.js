const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");
const profileRouter = express.Router();
const bcrypt = require("bcrypt");
const upload = require("../middlewares/multerConfig");

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

// Profile edit route
profileRouter.patch(
  "/profile/edit",
  userAuth,
  upload.single("photoFile"),
  async (req, res) => {
    console.log("hello from edit profile.js file ");
    try {
      const loggedInUser = req.user;

      // Validate required fields
      const { firstName, lastName, age, gender, about } = req.body;
      if (!firstName || firstName.length < 4) {
        throw new Error("First name must be at least 4 characters long.");
      }
      if (age && isNaN(age)) {
        throw new Error("Age must be a valid number.");
      }
      if (
        gender &&
        !["male", "female", "other"].includes(gender.toLowerCase())
      ) {
        throw new Error("Gender must be 'male', 'female', or 'other'.");
      }

      // Handle Cloudinary upload
      if (req.file) {
        loggedInUser.photoUrl = req.file.path; // Cloudinary URL is in `req.file.path`
      }

      // Update user data
      loggedInUser.firstName = firstName || loggedInUser.firstName;
      loggedInUser.lastName = lastName || loggedInUser.lastName;
      loggedInUser.age = age ? parseInt(age) : loggedInUser.age;
      loggedInUser.gender = gender || loggedInUser.gender;
      loggedInUser.about = about || loggedInUser.about;

      // Save changes to the database
      await loggedInUser.save();

      console.log("User profile updated successfully from profile.js.", loggedInUser);

      res.status(200).json({
        message: `${loggedInUser.firstName}, your profile was edited successfully.`,
        data: loggedInUser,
      });
    } catch (err) {
      console.error("Error editing profile:", err.message);
      res.status(400).json({ error: err.message });
    }
  }
);

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
