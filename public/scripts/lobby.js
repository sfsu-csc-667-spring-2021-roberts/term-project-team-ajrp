var gameForm = document.getElementById('gameForm');

async function getResponse(url, next) {
  let res = await fetch(url);
  let jason = await res.json();
  next(jason);
}

gameForm.addEventListener('submit', function(e) {
	e.preventDefault();
	getResponse("/game/createGame", function(jason) {
		socket.emit('/enterGame', jason);
	});
});

var pageForm = document.getElementById('pageForm');

socket.on('/enterGame', function(game_id) {
	var url = "/game/g/"+game_id+"/";
	pageForm.action = url;
	pageForm.submit();
});
