const mongoose = require("mongoose");

module.exports = mongoose.model(
  "Conversation",
  new mongoose.Schema({
    participant1:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    participant2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  })
);
