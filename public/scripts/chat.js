
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

gameForm.addEventListener('submit', function(e) {
	e.preventDefault();
	fetch("/game/createGame").then((idInfo) => {
		console.log(idInfo);
		socket.emit('enterGame', idInfo.id);
	}).catch((error) => {
		console.log(error);
	});
});

socket.on('enterGame', function(game_id) {
	console.log(game_id);
	fetch("/game/"+game_id+"").catch((error) => {
		console.log(error);
	});
});



