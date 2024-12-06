const fs = require("fs");

const deleteFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Unable to free-up space. Error: ", err);
    } else {
      console.log("Successfully cleared the space!");
    }
  });
};

module.exports = { deleteFile };
