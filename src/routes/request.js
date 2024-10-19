const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { User } = require("../models/user");
const ConnectionRequest = require("../models/connectionRequests");
const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {    
      const fromUserId = req.user._id;        // user 
      const status = req.params.status;        // interested/ignored
      const toUserId = req.params.toUserId;    // to another user or elon musk.

      const isStatusValid = ["ignored", "interested"];

      if (!isStatusValid.includes(status)) {
        return res.status(400).send("Invalid status");
      }

      if (toUserId == fromUserId) {
        return res
          .status(400)
          .send("Cannot send connection request to yourself");
      } 

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).send("User not found");
      }

      // if user already sent the connection request or they sent the connection request to the user:-
      const existingRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId: fromUserId, toUserId: toUserId },      // user to elon musk 
          { fromUserId: toUserId, toUserId: fromUserId },      // elon musk to user
        ],
      });

      if (existingRequest) {
        return res.status(400).send("Connection request already sent");
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      })  

      const data = await connectionRequest.save();

      res.json({ message: "connection request successfully", data: data });
    } catch (err) {
      res.status(400).send("Error:" + err.message);
    }
  }
);

module.exports = { requestRouter };
