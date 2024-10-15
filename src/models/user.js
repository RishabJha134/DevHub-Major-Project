const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 50,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },

    age: {
      type: Number,
      min: 18,
    },

    gender: {
      type: String,

      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender must be male, female or other");
        }
      },
    },

    photoUrl: {
      type: String,
      default:
        "https://media.istockphoto.com/id/1128484864/vector/user.jpg?s=612x612&w=0&k=20&c=QRjA76wOhJq1ywgsny3o_mwHCRc4uBmohqLZ4e52rP8=",
    },
    about: {
      type: String,
      default: "this is default value of the user",
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
