const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    // step1:- Read the token from the req cookies.
    const token = req.cookies.token;
    if (!token) {
      throw new Error("Invalid token!");
    }

    // step2:- Validate the token:-
    const decodedMessage = await jwt.verify(token, "secret-key");
    const { _id } = decodedMessage;
    console.log(JSON.stringify(decodedMessage));

    // step3:- Find the user:-
    const user = await User.findById({ _id: _id });
    if (!user) {
      throw new Error("User not found");
    }

    req.user = user;

    console.log(user);
    next();                   // next is called to move to the request handler.
    // res.send(user);
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
};

module.exports = {
  userAuth,
};


