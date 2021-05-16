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
  socket.on('enterGame', (id) => {
  	io.to(id).emit('enterGame');
  });
});

module.exports = {server, io, app};