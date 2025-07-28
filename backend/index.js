const express = require("express");
const http = require("http");
const socket = require("socket.io");
const app = express();




const server = http.createServer(app);
const io = socket(server);
const cors = require("cors");




const userRout = require("./routes/user.routes");
const messageRoute = require("./routes/message.routes");
const conversationRoute = require("./routes/conversation.routes");
const path = require("path");

app.use(cors(

));
app.use(express.json());
app.use("/media", express.static(path.join(__dirname, "media")));

require("./models");

app.use("/user", userRout);
app.use("/message", messageRoute);
app.use("/conversation", conversationRoute);

require("./config/socketIo")(io);

server.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
