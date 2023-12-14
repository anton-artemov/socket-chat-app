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






// const express = require("express");
// const app = express();
// const http = require("http");

// const { Server } = require("socket.io");
// const server = http.createServer(app);
// const io = new Server(server);

// const users = {};

// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/index.html");
// });

// io.on("connection", (socket) => {
//   console.log("a user connected");

//   // Broadcast to all users when someone connects
//   socket.broadcast.emit("user connected", "A user connected");

//   // Add support for nicknames
//   socket.on("set nickname", (nickname) => {
//     users[socket.id] = nickname;
//     io.emit("user online", Object.values(users));
//   });

//   // Don’t send the same message to the user that sent it
//   socket.on("chat message", (msg) => {
//     console.log("message: " + msg);
//     io.emit("chat message", { user: users[socket.id], message: msg });
//   });

//   // Add “{user} is typing” functionality
//   socket.on("typing", () => {
//     socket.broadcast.emit("typing", users[socket.id]);
//   });

//   socket.on("disconnect", () => {
//     console.log("user disconnected");
//     // Broadcast to all users when someone disconnects
//     io.emit("user disconnected", `${users[socket.id]} disconnected`);
//     delete users[socket.id];
//     io.emit("user online", Object.values(users));
//   });
  
// });

// server.listen(3000, () => {
//   console.log("listening on *:3000");
// });






// const express = require("express");
// const app = express();
// const http = require("http");

// const { Server } = require("socket.io");
// const server = http.createServer(app);
// const io = new Server(server);

// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/index.html");
// });

// io.on("connection", (socket) => {
//   console.log("a user connected");
//   io.emit("connection", "a user connected"); //sends an event to ALL registered clients (sockets)
//   socket.emit("welcome", "welcome new user"); //sends an event to ONLY the client who sent the server an event
//   socket.broadcast.emit("new user", "a new client connected to the server"); //sends an event to ALL clients EXCEPT the one who sent the server an event

//   socket.on("chat message", (msg) => {
//     console.log("message: " + msg);
//     io.emit("chat message", msg);
//   });

//   socket.on("disconnect", () => {
//     console.log("user disconnected");
//   });
// });

// server.listen(3000, () => {
//   console.log("listening on *:3000");
// });
