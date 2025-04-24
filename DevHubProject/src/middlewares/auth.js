const jwt = require("jsonwebtoken");
const { User } = require("../models/user");

const userAuth = async (req, res, next) => {
  console.log("userAuth called");
  try {
    // step1:- Read the token from the req cookies.
    const token = req.cookies.token;
    console.log("token from auth.js " + token);

    if (!token) {
      // throw new Error("Invalid token!");
      console.log("token" + token);
      return res.status(401).send("Invalid token");
    }

    // step2:- Validate the token:-
    const decodedMessage = jwt.verify(token, "secret-key");

    console.log("decodedMessage" + JSON.stringify(decodedMessage));
    
    
    console.log("decodedMessage._id " + decodedMessage._id);
    // console.log("decodedMessage.token" + JSON.stringify(decodedMessage.token));
    // console.log(_id)

    // const _id = decodedMessage.token;
    // console.log("decodedMessage._id" + _id);

    // step3:- Find the user:-
    const user = await User.findById({ _id: decodedMessage._id });
    if (!user) {
      throw new Error("User not found");
    }

    req.user = user;

    console.log(user);
    next(); // next is called to move to the request handler.
    // res.send(user);
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
};

module.exports = {
  userAuth,
};
