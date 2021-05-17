const cardList = document.getElementById("cardOwn");
const enemy1 = document.getElementById("enemy1");
const enemy2 = document.getElementById("enemy2");
const enemy3 = document.getElementById("enemy3");
const enemy4 = document.getElementById("enemy4");
const enemy5 = document.getElementById("enemy5");
const discarded = document.getElementById("discarded");
const turn = document.getElementById("turn");
var listEnemies = [];
var listEnemies = [enemy1, enemy2, enemy3, enemy4, enemy5];
var gameID = document.getElementById('game_id').value;
var uid = document.getElementById('player_id').value;
var starter = document.getElementById('starter').value;
var nextPlayer = 0;

async function getResponse(url, next) {
	let res = await fetch(url);
	let jason = await res.json();
	next(jason);
}

//tthis one is noot complete
function addEnemy(item, index) {
	if (item.player_id == uid) {
		nextPlayer = item.next;
		return;
	}
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
function addOwnCard(item) {
	var newForm = document.createElement('form');
	newForm.className = "player-cards";
	newForm.id = item.id;
	cardList.appendChild(newForm);
	var newLabel = document.createElement('label');
	newLabel.setAttribute("for", "id");
	newLabel.textContent = item.name;
	newForm.appendChild(newLabel);
	var newInput = document.createElement('input');
	newInput.type = "submit";
	newInput.disabled = true;
	newInput.setAttribute("name", "submit");
	newInput.value = "Play Card";
	newForm.appendChild(newInput);
	newForm.addEventListener('submit', function(e) {
		e.preventDefault();
		var url = "/game/playCard/"+gameID+"/"+item.id;
		getResponse(url, function(jason) {
			socket.emit('/cardPlayed', {game: gameID, owner: uid, cardID: item.id, cardName: item.name});
			socket.emit(item.function, {game: gameID, owner: uid, cardID: item.id, cardName: item.name, cardImage: item.image_url});
		});
	});
}

function getFirstCards() {
	getResponse("/game/getFirstCards/"+gameID, function(jason) {
		jason.forEach(addOwnCard);
	});
}

getFirstCards();

function addEnemyCard(item) {
	listEnemies.forEach((element) => {
		if (element.getAttribute("name") == item.owner) {
			var newLabel = document.createElement('label');
			newLabel.textContent = "Hidden Card";
			element.appendChild(newLabel);
			var breaku = document.createElement('br');
			element.appendChild(breaku);
		}
	});
}

function groupEnemyCards() {
	if (starter == uid) {
		turn.innerHTML = "Your Turn";
		enableCards();
	} else {
		turn.innerHTML = "Enemy Turn";
	}
	getResponse("/game/getEnemyCards/"+gameID, function(jason) {
		jason.forEach(addEnemyCard);
	});
}

function removeEnemyCard(item) {
	listEnemies.forEach((element) => {
		if (element.getAttribute("name") == item.owner) {
			element.removeChild(element.childNodes[0]);
			element.removeChild(element.childNodes[0]);
		}
	});
}

function putDownCard(item) {
	discarded.style.display = "inline";
	discarded.childNodes[0].textContent = item.cardName;
	cardList.childNodes.forEach((element, index) => {
		if (element.getAttribute("id") == item.cardID) {
			cardList.removeChild(cardList.childNodes[index]);
		}
	});
}

function enableCards() {
	cardList.childNodes.forEach((element, index) => {
		element.childNodes[1].disabled = false;
	});
}

function disableCards() {
	cardList.childNodes.forEach((element, index) => {
		if (element.childNodes[0].textContent != "Nope") {
			element.childNodes[1].disabled = true;
		}
	});
}

function findIfTurn(item) {
	if (uid == item.next) {
		turn.innerHTML = "Your Turn";
		enableCards();
	} 
}

const deck = document.getElementById("deck");

deck.addEventListener('submit', function(e) {
	e.preventDefault();
	var url = "/game/deck/"+gameID;
	getResponse(url, function(jason) {
		addOwnCard(jason, 0);
		turn.innerHTML = "Enemy Turn";
		disableCards();
		socket.emit("/deck", {game: gameID, owner: uid, next: nextPlayer});
	});
});

socket.on('/deck', function(ownerJason) {
	findIfTurn(ownerJason);
	addEnemyCard(ownerJason, 0);
});

socket.on('/cardPlayed', function(ownerJason) {
	removeEnemyCard(ownerJason);
	putDownCard(ownerJason);
});

setTimeout(groupEnemyCards, 200);


