const mongoose = require("mongoose");

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.DB_CONNECTION_SECRET
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
