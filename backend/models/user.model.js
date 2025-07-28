const mongoose = require("mongoose");
module.exports = mongoose.model(
  "User",
  new mongoose.Schema({
    email: {
      unique: true,
      type: String,
      required: true,
    },
    name: { type: String, required: true },
    password: { type: String, required: true },
    status: {
      connected: {
        type: Boolean,
        default: false,
      },
      lastConnected: {
        type: Date,
        default: Date.now,
      },
    },
    avatar: { type: String, default: "" },
  })
);

