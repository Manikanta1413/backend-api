const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const fs = require("fs");

const uploadDirectory = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

// Set Storage Engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDirectory); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = crypto.randomBytes(16).toString("hex");
    cb(null, `${uniqueName}${ext}`);
  },
});

// File Filter: only allow jpg/jpeg/png
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error("Only image files are allowed!"), false); // Reject the file
  }
};

// Limit size: 1MB
const limits = {
  fileSize: 5 * 1024 * 1024, // 1MB
};

const upload = multer({
  storage,
  fileFilter,
  limits,
});

module.exports = upload;
