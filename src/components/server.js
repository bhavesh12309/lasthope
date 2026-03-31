const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http, { cors: { origin: "*" } });

let players = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("updateScore", (data) => {
    players[socket.id] = data;
    io.emit("liveLeaderboard", Object.values(players));
  });

  socket.on("disconnect", () => {
    delete players[socket.id];
    io.emit("liveLeaderboard", Object.values(players));
  });
});

http.listen(3001, () => console.log("Server running on :3001"));
