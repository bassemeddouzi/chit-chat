const multer = require("multer");
const path = require("path");
const uuid = require("uuid").v4;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "media/messages/");
  },
  filename: function (req, file, cb) {
    const id = uuid();
    cb(null, id + path.extname(file.originalname));
  },
});

module.exports = multer({ storage  });