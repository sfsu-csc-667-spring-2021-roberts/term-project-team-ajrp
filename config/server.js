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
  socket.on('newMessage', (msg) => {
  	io.emit('newMessage', msg);
  });
});

module.exports = {server, io, app};