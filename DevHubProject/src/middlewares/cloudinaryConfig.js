const cloudinary = require("cloudinary").v2;

// Cloudinary configuration
cloudinary.config({
  cloud_name: "debffb5tk", // Replace with your Cloudinary cloud name
  api_key: "767839345551917", // Replace with your Cloudinary API key
  api_secret: "8Nm-65hsrASsxGIC4fyicX4yCJI", // Replace with your Cloudinary API secret
});

module.exports = cloudinary;
