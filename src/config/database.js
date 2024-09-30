const mongoose = require("mongoose");

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://dbAdmin:dbAdmin%4012345@cluster0.voja2.mongodb.net/devTinder"
    );
    console.log("MongoDB Connected...");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
};

// connectDB();

module.exports = {
  connectDB,
};
