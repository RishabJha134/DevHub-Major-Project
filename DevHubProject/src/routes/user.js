const express = require("express");
const { authRouter } = require("./auth");
const ConnectionRequest = require("../models/connectionRequests");
const { userAuth } = require("../middlewares/auth");
const { User } = require("../models/user");
const userRouter = express.Router();

// get all pending requests for the logged in user:-
userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    console.log(loggedInUser);

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate(
      "fromUserId",
      "firstName lastName photoUrl age gender about skills"
    );
    console.log(connectionRequests);

    res.status(200).json({
      message: "All Connection Requests",
      data: connectionRequests,
    });
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
});

// to get all connections of the user:-
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    // console.log(loggedInUser);

    const connections = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate(
        "fromUserId",
        "firstName lastName photoUrl age gender about skills"
      )
      .populate(
        "toUserId",
        "firstName lastName photoUrl age gender about skills"
      );

    console.log(connections);
    const data = connections.map((item) => {
      if (item.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return item.toUserId;
      }
      return item.fromUserId;
    });
    console.log("data->" + data);

    res.json({ message: "Connections", data: data });
  } catch (error) {
    res.status(400).send("Error:" + error.message);
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 11;
    if (limit > 50) {
      limit = 50;
    } else {
      limit = limit;
    }
    const skip = (page - 1) * limit;

    console.log("page=" + page + " limit=" + limit + " skip=" + skip);
    // agar connectonRequestSchema me already user present hai iska matlab hai ki either his status is skip,interested,accepted,rejected so no need to show in the feed.
    //1. if status is skip or interested then it is not show in feed because request is already in progress:-
    //2. if already present in the connection then it is not show in feed only fresh/new users:-
    //3. user can not send request to itself:-

    // or:-
    // User should see all the cards except:-
    //0. his own card:-
    //1. his connections:- ["ignored", "interested", "accepted", "rejected"]
    //2. ignored people:-
    //3. already sent the connection request or already recieved the connection request:-

    //step1:- find out the connection request jo maine bheja hai aur jo mujhe aaya hai:-
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }], // sent + recieved
    }).select("fromUserId toUserId");
    console.log("connectionRequests->" + connectionRequests);

    //step2:- jo bhi user hai jisko humne send kara hai ya recieve kara hai usko remove kardo from feed:-
    const hideUserFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUserFromFeed.add(req.fromUserId.toString());
      hideUserFromFeed.add(req.toUserId.toString());
    });
    console.log("hideUserFromFeed ->", hideUserFromFeed);

    //step3:- show only fresh Users in feed:-
    const freshUsers = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select("firstName lastName photoUrl age gender about skills")
      .skip(skip)
      .limit(limit);

    console.log("freshUsers->" + freshUsers);

    res.json({
      message: "connection requests send and recieve",
      data: freshUsers,
    });
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
});

userRouter.get("/getUserDetails/:id", userAuth, async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    console.log("user Details->" + user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      message: "User Details",
      data: user,
    });
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
});

module.exports = { userRouter };
