const { updateProfile } = require("../Controllers/User.Controler");
const { sendMessageSocket } = require("../controllers/Message.Controler");
const { User, Conversation, Message } = require("../models");
const {
} = require("../Controllers/Converstation.Controler");
const jwt = require("jsonwebtoken");

const userConnected = {};
module.exports = (io) => {
  io.on("connection", (socket) => {
    socket.on("login", async (token) => {
      try {
        const userProfile = jwt.verify(token, process.env.TokenSecret);
        socket.join(`user:${userProfile._id}`);
        socket.userId = userProfile._id;
        if (!userConnected[userProfile._id])
          userConnected[userProfile._id] = {};
        userConnected[userProfile._id][socket.id] = "";
        await User.updateOne(
          { _id: userProfile._id },
          {
            status: {
              connected: true,
              lastConnected: Date.now(),
            },
          }
        );
        socket.emit("check", userConnected);
      } catch (err) {
        console.error("login error:", err);
        socket.emit("error", "Failed to login");
      }
    });
    socket.on("sendMessage", async ({ newMessage, to_user }) => {
      try {
        const message =
          newMessage.type === "text"
            ? await sendMessageSocket(newMessage)
            : newMessage;
        io.to(`user:${to_user}`).emit("receiveMessage", message);
      } catch (err) {
        console.error("sendMessage error:", err);
        socket.emit("error", "Failed to send message");
      }
    });
    socket.on("getSocketID", async ({ type, from_user, to_user }) => {
      try {
        const socketId = Object.keys(userConnected[to_user])[0];
        socket.emit("getSocketID", { socketId, type, from_user, to_user });
        io.to(socketId).emit("receiveCall", {
          from_user,
          socketId: socket.id,
          type,
        });
      } catch (err) {
        console.error("getSocketID error:", err);
        socket.emit("error", "Failed to get Socket ID");
      }
    });
    socket.on("acceptCall", ({ toSocketId, peerOffer }) => {
      io.to(toSocketId).emit("acceptCall", { peerOffer });
    });
    socket.on("rejectCall", ({ toSocketId }) => {
      io.to(toSocketId).emit("rejectCall");
    });
    socket.on("endCall", ({ toSocketId }) => {
      io.to(toSocketId).emit("endCall");
    });
    socket.on("markRead", async ({ conversationId }) => {
      if (!socket.userId || !conversationId) return;

      await Message.updateMany(
        {
          conversation: conversationId,
          read: false,
          senderId: { $ne: socket.userId },
        },
        { $set: { read: true } }
      );

      io.to(`conversation:${conversationId}`).emit("messagesRead", {
        conversationId,
        readerId: socket.userId,
      });
    });
    socket.on("disconnect", () => {
      if (socket.userId) {
        userConnected[socket.userId][socket.id] = null;
        delete userConnected[socket.userId][socket.id];

        if (Object.keys(userConnected[socket.userId]).length === 0) {
          delete userConnected[socket.userId];
          User.updateOne(
            { _id: socket.userId },
            { status: { connected: false, lastConnected: Date.now() } }
          );
        }
      }
    });
  });
};
