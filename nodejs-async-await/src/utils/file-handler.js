const path = require("path");
const fs = require("fs");

const multer = require("multer");

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dirPath = path.join(__dirname, "..", "images");

    // Check if directory exists, if not create it
    fs.exists(dirPath, (exists) => {
      if (!exists) {
        fs.mkdirSync(dirPath); // create the directory
      }

      cb(null, path.join("src", "images")); // Use the directory path
    });
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const clearFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Failed to remove file, Error: ", err);
    } else {
      console.log("Old image cleared");
    }
  });
};

module.exports = { fileStorage, fileFilter, clearFile };
