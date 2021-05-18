var gameForm = document.getElementById('gameForm');
var gameName = document.getElementById('nameInfo').value;
var lobbyID = document.getElementById('lobby_id').value;
var uid = document.getElementById('player_id').value;
var uname = document.getElementById('username').value;
var members = document.getElementsByClassName('current-players')[0];
var exitForm = document.getElementById('exitForm');

async function getResponse(url, next) {
  let res = await fetch(url);
  let jason = await res.json();
  next(jason);
}

function removeAllChildren(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

async function updateMembers(info) {
	await removeAllChildren(members);
	info.forEach((item) => {
		var newDiv = document.createElement('div');
		newDiv.setAttribute("class", "player-container");
		members.appendChild(newDiv);
		var newImg = document.createElement('img');
		newImg.src = "/assets/kitten-profile.png";
		newImg.alt = "Kitten Profile";
		newDiv.appendChild(newImg);
		var newP = document.createElement('p');
		newP.innerHTML = item.username;
		newDiv.appendChild(newP);
	});
}

socket.emit('/enteredLobby', {lobby: lobbyID, username: uname});
socket.on('/enteredLobby', function(jason) {
	var url = "/dashboard/getMembers/"+lobbyID;
	getResponse(url, async function(jason) {
		updateMembers(jason);
	});
})

/*
exitForm.addEventListener('submit', function(e) {
	e.preventDefault();
	var url = "/game/createGame/"+gameName+"/"+lobbyID;
	getResponse(url, function(jason) {
		jason["starter"] = uid;
		socket.emit('/enterGame', jason);
	});
});*/

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
