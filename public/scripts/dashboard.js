const lobbyList = document.getElementById("lobby");
const createForm = document.getElementById("createLobby");
const pageForm = document.getElementById('pageForm');

async function getResponse(url, next) {
	let res = await fetch(url);
	let jason = await res.json();
	next(jason);
}

createForm.addEventListener('submit', function(e) {
	e.preventDefault();
	getResponse("/dashboard/createLobby", function(jason) {
		pageForm.action = "/dashboard/lobby/"+jason.id;
		pageForm.setAttribute("method", "GET");
		pageForm.submit();
	});
});

function addLobby(item) {
	var newForm = document.createElement('form');
	newForm.className = "lobbies-form";
	lobbyList.appendChild(newForm);
	var newLabel = document.createElement('label');
	newLabel.setAttribute("for", "id");
	newLabel.textContent = item.game_name + " created at: " + item.create_at.toString() + " by " + item.username + " - ";
	newForm.appendChild(newLabel);
	var newInput = document.createElement('input');
	newInput.type = "submit";
	newInput.setAttribute("name", "submit");
	newInput.value = "Join Lobby";
	newForm.appendChild(newInput);
	newForm.action = "/dashboard/lobby/"+item.id;
	newForm.setAttribute("method", "GET");
}

function getLobbies() {
	getResponse("/dashboard/lobbies", function(jason) {
		jason.forEach(addLobby);
	});
}

getLobbies();



