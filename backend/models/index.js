const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
require('dotenv').config();

async function main() {
    await mongoose.connect(process.env.MONGO_URL);
}
main().then(()=>console.log("db is connceted")).catch((err) => console.log(err));
const User = require('./user.model')
const Message = require('./message.model')
const Conversation = require('./conversation.model')
module.exports = {User,Message,Conversation}