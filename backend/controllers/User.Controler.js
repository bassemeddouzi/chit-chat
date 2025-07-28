const { User } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password)
        return res
          .status(400)
          .send({ error: "Email and password are required" });

      const user = await User.findOne({ email });
      if (!user) return res.status(404).send({ error: "You need to register first !!!" });

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid)
        return res.status(400).send({ error: "Incorrect password" });

      const token = jwt.sign(
        { _id: user._id, email: user.email },
        process.env.TokenSecret
      );

      await User.findByIdAndUpdate(user._id, {
        status: { connected: true, lastConnected: Date.now() },
      });

      res.status(200).send({
        token
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({ error: err.message });
    }
  
  },

  register: async (req, res) => {
    try {
      const avatar = req.file?.filename || "";
      const { email, password, name } = req.body;

      if (!email || !password || !name)
        return res
          .status(400)
          .send({ error: "Name, email, and password are required" });

      if (await User.findOne({ email }))
        return res.status(400).send({ error: "Email already exists" });

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        email,
        name,
        password: hashedPassword,
        avatar,
      });

      const token = jwt.sign(
        { _id: newUser._id, email: newUser.email },
        process.env.TokenSecret
      );

      res.status(200).send({
        token
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({ error: err.message });
    }
  },
  logout: async (req, res) => {
    try {
      await User.findByIdAndUpdate(req.owner._id, {
        status: { connected: false, lastConnected: Date.now() },
      });
      res.status(200).send({ message: "Logout successful" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: error.message });
    }
  },

  updateProfile: async (req, res) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const updatedUser = await User.findOneAndUpdate(
        { _id: req.owner._id },
        req.body,
        {
          new: true,
        }
      );

      res.status(200).send({token });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: error.message });
    }
  },

  getProfile: async (req, res) => {
    try {
      const user = await User.findById(req.owner._id);
      if (!user) return res.status(404).json({ error: "User not found" });

      const { email, name, avatar, connected } = user;
      res.status(200).json({ _id: user._id, email, name, avatar, connected });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getAnyUserProfile: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).send({ error: "User not found" });

      const { _id, email, name, avatar, connected } = user;
      res.status(200).send({ _id, email, name, avatar, connected });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },

  getSearchUsers: async (req, res) => {
    try {
      const { searchName } = req.body;
      const users = await User.find({
        name: { $regex: searchName, $options: "i" },
      }).select("_id name email avatar status");

      res.status(200).send( users );
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: error.message });
    }
  },
};
