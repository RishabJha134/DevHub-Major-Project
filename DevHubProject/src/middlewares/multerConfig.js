const fs = require("fs");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const path = require("path");
const cloudinary = require("./cloudinaryConfig");

// Multer storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "profile_pictures", // Folder in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png","webp","avif"], // Allowed file types
  },
});

const upload = multer({ storage });
module.exports = upload;
