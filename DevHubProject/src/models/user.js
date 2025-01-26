const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address");
        }
      },
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
      enum: {
        values: ["male", "female", "other"],
        message: `{VALUE} is not a valid gender type`,
      },

      // validate(value) {
      //   if (!["male", "female", "others"].includes(value)) {
      //     throw new Error("Gender must be male, female or other");
      //   }
      // },
    },

    photoUrl: {
      type: String,
      default:
        "https://media.istockphoto.com/id/1128484864/vector/user.jpg?s=612x612&w=0&k=20&c=QRjA76wOhJq1ywgsny3o_mwHCRc4uBmohqLZ4e52rP8=",

      // validate(value) {
      //   if (!validator.isURL(value)) {
      //     throw new Error("Invalid photo URL");
      //   }
      // },
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

// async function getJWT(user) {
//   const token = await jwt.sign({ _id: user._id }, "secret-key", {
//     expiresIn: "7d",
//   });

//   return token;
// }

// compounding index:- when we want to find user firstName and lastName:-
// userSchema.index({ firstName: 1, lastName: 1 });

// getJWT
userSchema.methods.getJWT = async function () {
  const user = this;
  console.log("user from user model"+user);
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET , { expiresIn: "7d" });
  return token;
};

// validatePassword
userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const hashedPassword = user.password;
  const isMatch = await bcrypt.compare(passwordInputByUser, hashedPassword);
  return isMatch;
};

const User = new mongoose.model("User", userSchema);
// module.exports = User;
module.exports = { User };
