const { Conversation, Message, User } = require("../models");
const jwt = require("jsonwebtoken");

module.exports = {
  getConversation: async (req, res) => {
    try {
      const conversations = await Conversation.find({
        $or: [{ participant1: req.owner._id }, { participant2: req.owner._id }],
      })
        .populate({
          path: "participant1",
          select:
            "name email avatar connected _id status",
        })
        .populate({
          path: "participant2",
          select:
            "name email avatar connected _id status",
        })
        .populate({
          path: "lastMessage",
          select: "content sender type read timestamp",
        })
        .sort({ updatedAt: -1 })

        .limit(10);

      res.status(200).send(conversations);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Internal server error" });
    }
  },
  startConversation: async (req, res) => {
    try {
      const { participantsEmail } = req.body;
      const user = await User.findOne({ email: participantsEmail });
      if (!user) {
        console.error("User not found");
        return res.status(404).send({ error: "User not found" });
      }

      const existConv = await Conversation.findOne({
        $or: [
          { participant1: req.owner._id, participant2: user._id },
          { participant1: user._id, participant2: req.owner._id },
        ],
      })
        .populate({
          path: "participant1",
          select:
            "name email avatar connected _id status.connected status.lastConnected",
        })
        .populate({
          path: "participant2",
          select:
            "name email avatar connected _id status.connected status.lastConnected",
        });

      if (existConv) {
        return res.status(200).send(existConv);
      }

      const newConversation = await Conversation.create({
        participant1: req.owner._id,
        participant2: user._id,
      });

      await newConversation.populate({
        path: "participant1",
        select:
          "name email avatar connected _id status.connected status.lastConnected",
      });

      await newConversation.populate({
        path: "participant2",
        select:
          "name email avatar connected _id status.connected status.lastConnected",
      });

      res.status(201).send(newConversation);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Internal server error" });
    }
  },
  readItConversation: async (req, res) => {
    try {
      const conv_Id = req.params.id;

      const conversation = await Conversation.findById(conv_Id);
      if (!conversation) {
        return res.status(404).send({ error: "Conversation not found" });
      }
      const list_message = await Message.updateMany(
        {
          conversation: conv_Id,
          read: false,
          senderId: { $ne: req.owner._id },
        },
        {
          $set: { read: true },
        }
      );

      res.status(200).send({ message: "Conversation marked as read" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Internal server error" });
    }
  },
  readItConversationSocket: async (conv_Id, userId) => {
    try {
      const conversation = await Conversation.findById(conv_Id);
      if (!conversation) {
        throw new Error("Conversation not found");
      }
      const list_message = await Message.updateMany(
        {
          conversation: conv_Id,
          read: false,
          senderId: { $ne: userId },
        },
        {
          $set: { read: true },
        }
      );
    } catch (error) {
      return error;
    }
  },
};
