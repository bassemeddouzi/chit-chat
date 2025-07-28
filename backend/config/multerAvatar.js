const multer = require("multer");
const path = require("path");
const uuid = require("uuid").v4;
module.exports = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "media/avatars/");
    },
    filename: function (req, file, cb) {
      const id = uuid();
      cb(null, id + path.extname(file.originalname));
    },
  }),
  fileFilter: function (req, file, cb) {
    console.log(file)
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(null, false);
  },
});
