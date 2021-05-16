//var io = require('../../config/server').socket;
var socket = io();

var messages = document.getElementById('messages');
var form = document.getElementById('messageForm');
var input = document.getElementById('messageInput');

form.addEventListener('submit', function(e) {
	e.preventDefault();
	if (input.value) {
		socket.emit('newMessage', input.value);
		input.value = '';
	}
});

socket.on('newMessage', function(msg) {
	var item = document.createElement('li');
	item.textContent = msg;
	messages.appendChild(item);
});