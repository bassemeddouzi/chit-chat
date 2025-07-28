const mongoose = require("mongoose");

module.exports = mongoose.model(
  "Message",
  new mongoose.Schema({
    conversation: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation" },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    type: {
      type: String,
      enum: ["text", "image", "video", "voice", "file"],
      default: "text",
    },
    content: String,
    read: {
      type: Boolean,
      default: false,
    },
    timestamp: { type: Date, default: Date.now },
  })
);