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
  socket.on('/joinRoom', (id) => {
    socket.join(id);
  });
  socket.on('/newMessage', (info) => {
  	io.to(info.id).emit('/newMessage', info.msg);
  });
  socket.on('/enterGame', (info) => {
  	io.to(info.lobby.toString()).emit('/enterGame', info);
  });
  socket.on('/deck', (info) => {
  	io.to(info.game.toString()).emit('/deck', info);
  });
  socket.on('/cardPlayed', (info) => {
  	io.to(info.game.toString()).emit('/cardPlayed', info);
  });
  socket.on('/playNope', (info) => {
  	io.to(info.game.toString()).emit('/playNope', info);
  });
  socket.on('/playAttack', (info) => {
  	io.to(info.game.toString()).emit('/playAttack', info);
  });
  socket.on('/playSkip', (info) => {
  	io.to(info.game.toString()).emit('/playSkip', info);
  });
  socket.on('/playFavor', (info) => {
  	io.to(info.game.toString()).emit('/playFavor', info);
  });
  socket.on('/playShuffle', (info) => {
  	io.to(info.game.toString()).emit('/playShuffle', info);
  });
  socket.on('/playSee', (info) => {
  	io.to(info.game.toString()).emit('/playSee', info);
  });
  socket.on('/playSpecial', (info) => {
  	io.to(info.game.toString()).emit('/playSpecial', info);
  });
  socket.on('/playExplode', (info) => {
  	io.to(info.game.toString()).emit('/playExplode', info);
  });
  socket.on('/playDefuse', (info) => {
  	io.to(info.game.toString()).emit('/playExplode', info);
  });
});

module.exports = {server, io, app};