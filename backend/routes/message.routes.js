const express = require("express");
const router = express.Router();
const messageController = require("../Controllers/Message.Controler");
const tokenAuth = require("../middlawear/tokenAuth");
const messageMulter = require("../config/multerMessage");
router.get("/:id", tokenAuth, messageController.getMessages);
router.post(
  "/",
  tokenAuth,
  messageMulter.single("file"),
  messageController.sendMessageHttp
);
module.exports = router;
