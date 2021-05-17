var gameForm = document.getElementById('gameForm');
var gameName = document.getElementById('nameInfo').value;
var lobbyID = document.getElementById('lobby_id').value;
var uid = document.getElementById('player_id').value;

async function getResponse(url, next) {
  let res = await fetch(url);
  let jason = await res.json();
  next(jason);
}

gameForm.addEventListener('submit', function(e) {
	e.preventDefault();
	var url = "/game/createGame/"+gameName+"/"+lobbyID;
	getResponse(url, function(jason) {
		jason["starter"] = uid;
		socket.emit('/enterGame', jason);
	});
});

var pageForm = document.getElementById('pageForm');

socket.on('/enterGame', function(jason) {
	var url = "/game/g/"+jason.game+"/"+jason.starter;
	pageForm.action = url;
	pageForm.setAttribute("method", "GET");
	pageForm.submit();
});
