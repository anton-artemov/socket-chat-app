const express = require("express");
const app = express();
const http = require("http");

const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server);

const users = {};

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("set nickname", (nickname) => {
    users[socket.id] = nickname;
    io.emit("user online", Object.values(users));
  });

  socket.on("chat message", (msg) => {
    io.emit("chat message", { user: users[socket.id], message: msg });
  });

  socket.on("typing", () => {
    socket.broadcast.emit("typing", users[socket.id]);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    delete users[socket.id];
    io.emit("user online", Object.values(users));
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
