const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    status: {
      type: String,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is incorrect status type`,
      },
    },
  },
  {
    timestamps: true,
  }
);

// compound index:-
// if we want to find the both at same time from user id and to user id both with efficent way then we use this. 
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

const ConnectionRequest = new mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);
module.exports = ConnectionRequest;
