var app = require('../app');
var http = require('http');

const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on('joinRoom', (id) => {
    socket.join(id);
  });
  socket.on('newMessage', (info) => {
  	io.to(info.id).emit('newMessage', info.msg);
  });
  socket.on('enterGame', (info) => {
  	io.to(info.lobby.toString()).emit('enterGame', info.game);
  });
  socket.on('deck', (info) => {
  	io.to(info.game.toString()).emit('deck', info);
  });
});

module.exports = {server, io, app};