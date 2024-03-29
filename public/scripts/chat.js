
var socket = io();
var data = document.getElementById('info').value;
socket.emit("/joinRoom", data);

var messages = document.getElementById('messages');
var messageForm = document.getElementById('messageForm');
var input = document.getElementById('messageInput');

messageForm.addEventListener('submit', function(e) {
	e.preventDefault();
	if (input.value) {
		socket.emit('/newMessage', {msg: input.value, id: data});
		input.value = '';
	}
});

socket.on('/newMessage', function(msg) {
	var item = document.createElement('li');
	item.textContent = msg;
	messages.appendChild(item);
});



