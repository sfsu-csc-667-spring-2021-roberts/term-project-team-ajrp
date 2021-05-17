const cardList = document.getElementById("cardOwn");
var listEnemies = [];
const enemy1 = document.getElementById("enemy1");
const enemy2 = document.getElementById("enemy2");
const enemy3 = document.getElementById("enemy3");
const enemy4 = document.getElementById("enemy4");
const enemy5 = document.getElementById("enemy5");
var listEnemies = [enemy1, enemy2, enemy3, enemy4, enemy5];
var gameID = document.getElementById('game_id').value;
var uid = document.getElementById('player_id').value;

async function getResponse(url, next) {
	let res = await fetch(url);
	let jason = await res.json();
	next(jason);
}

//tthis one is noot complete
function addEnemy(item, index) {
	listEnemies[index].setAttribute("name", item.player_id);
	listEnemies[index].addEventListener('submit', function(e) {
		e.preventDefault();
		var url = "/game/playCard/"+gameID+"/"+item.player_id;
		var emition = item.player_id;
		getResponse(url, function(jason) {
			socket.emit(emition);
		});
	});
}

function getEnemies() {
	getResponse("/game/getPlayers/"+gameID, function(jason) {
		jason.forEach(addEnemy);
	});
}

getEnemies();

//this one is not complete
function addOwnCard(item, index) {
	var newForm = document.createElement('form');
	newForm.className = "player-cards";
	cardList.appendChild(newForm);
	var newLabel = document.createElement('label');
	newLabel.setAttribute("for", "id");
	newLabel.textContent = item.name;
	newForm.appendChild(newLabel);
	var newInput = document.createElement('input');
	newInput.type = "hidden";
	newInput.setAttribute("name", "id");
	newInput.value = item.id;
	newForm.appendChild(newInput);
	newInput = document.createElement('input');
	newInput.type = "hidden";
	newInput.setAttribute("name", "function");
	newInput.value = item.function;
	newForm.appendChild(newInput);
	newInput = document.createElement('input');
	newInput.type = "submit";
	newInput.setAttribute("name", "submit");
	newInput.value = "Play Card";
	newForm.appendChild(newInput);
	newForm.addEventListener('submit', function(e) {
		e.preventDefault();
		var url = "/game/playCard/"+gameID+"/"+item.id;
		var emition = item.function;
		getResponse(url, function(jason) {
			socket.emit(emition);
		});
	});
}

function getFirstCards() {
	getResponse("/game/getFirstCards/"+gameID, function(jason) {
		jason.forEach(addOwnCard);
	});
}

getFirstCards();

function addEnemyCard(item, index) {
	listEnemies.forEach((element) => {
		if (element.name === item.owner) {
			var newLabel = document.createElement('label');
			newLabel.textContent = "Hidden Card";
			element.appendChild(newLabel);
		}
	});
}

function groupEnemyCards() {
	getResponse("/game/getEnemyCards/"+gameID, function(jason) {
		jason.forEach(addEnemyCard);
	});
}

groupEnemyCards();

const deck = document.getElementById("deck");
deck.addEventListener('submit', function(e) {
	e.preventDefault();
	var url = "/game/deck/"+gameID;
	getResponse(url, function(jason) {
		addOwnCard(jason, 0);
		socket.emit("deck", {game: gameID, owner: uid});
	});
});

socket.on('deck', function(ownerJason) {
	addEnemyCard(ownerJason, 0);
});




