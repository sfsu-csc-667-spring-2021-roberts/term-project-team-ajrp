
var socket = io();
var data = document.getElementById('info').value;
socket.emit("joinRoom", data);

var messages = document.getElementById('messages');
var messageForm = document.getElementById('messageForm');
var input = document.getElementById('messageInput');

messageForm.addEventListener('submit', function(e) {
	e.preventDefault();
	if (input.value) {
		socket.emit('newMessage', {msg: input.value, id: data});
		input.value = '';
	}
});

socket.on('newMessage', function(msg) {
	var item = document.createElement('li');
	item.textContent = msg;
	messages.appendChild(item);
});

var gameForm = document.getElementById('gameForm');

async function getResponse(url, next) {
  let res = await fetch(url);
  let jason = await res.json();
  next(jason);
}

gameForm.addEventListener('submit', function(e) {
	e.preventDefault();
	getResponse("/game/createGame", function(jason) {
		socket.emit('enterGame', jason);
	});
});

var pageForm = document.getElementById('pageForm');

socket.on('enterGame', function(game_id) {
	var url = "/game/g/"+game_id+"/";
	pageForm.action = url;
	pageForm.submit();
});



