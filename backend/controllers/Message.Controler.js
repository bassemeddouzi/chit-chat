const { Message, Conversation } = require("../models");
const jwt = require("jsonwebtoken");

module.exports = {
  sendMessageSocket: async (body) => {
    try {
      const { conversation, type = "text", content = "", senderId } = body;

      const message = await Message.create({
        conversation,
        senderId,
        type,
        content,
      });
      await Conversation.findByIdAndUpdate(conversation, {
        lastMessage: message._id,
      })
      return message;
    } catch (error) {
      console.error("Error sending message:", error.message);
      throw new Error("Failed to send message");
    }
  },
  sendMessageHttp: async (req, res) => {
    try {
      const { conversationId, type = "text", content = "", senderId } = req.body;
      let finalContent = content;
      if (req.file) {
        finalContent = `/media/messages/${req.file.filename}`;
      }
      const message = await Message.create({
        conversation: conversationId,
        senderId: senderId,
        type,
        content: finalContent,
      });
      res.status(200).send( finalContent );
    } catch (error) {
      console.error("Error sending message:", error.message);
      throw new Error("Failed to send message");
    }
  },

  getMessages: async (req, res) => {
    try {
      const conversationId = req.params.id;
      const page = parseInt(req.query.page) || 1;
      const messages = await Message.find({ conversation: conversationId })
        .sort({ timestamp: -1 })
        .skip((page - 1) * 25)
        .limit(25)
        .populate({
          path: "senderId",
          select: "name connected avatar email _id",
        });
      res.status(200).send({ messages });
    } catch (error) {
      console.error("Failed to get messages:", error.message);
      res.status(500).json({ error: "Failed to retrieve messages" });
    }
  },

  ReadMessage: async (messageId) => {
    try {
      const message = await Message.findById(messageId);
      if (!message) {
        throw new Error("Message not found");
      }
      message.read = true;
      await message.save();
      return message;
    } catch (error) {
      console.error("Failed to mark message as read:", error.message);
      throw new Error("Failed to mark message as read");
    }
  },
};
