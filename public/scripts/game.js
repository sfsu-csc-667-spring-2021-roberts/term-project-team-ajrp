const cardList = document.getElementById("cardOwn");
const enemy1 = document.getElementById("enemy1");
const enemy2 = document.getElementById("enemy2");
const enemy3 = document.getElementById("enemy3");
const enemy4 = document.getElementById("enemy4");
const enemy5 = document.getElementById("enemy5");
const discarded = document.getElementById("discarded");
const turn = document.getElementById("turn");
const explode = document.getElementById("explode");
var toPlay = document.getElementById('toPlay');
var pullDeck = document.getElementById('pullDeck');
var locationDiv = document.getElementById('locationDiv');
var listEnemies = [];
var listEnemies = [enemy1, enemy2, enemy3, enemy4, enemy5];
var gameID = document.getElementById('game_id').value;
var uid = document.getElementById('player_id').value;
var starter = document.getElementById('starter').value;
var username = document.getElementById('username').value;
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
			explode.innerHTML = "";
			socket.emit('/cardPlayed', {game: gameID, owner: uid, cardID: item.id, cardName: item.name, next: nextPlayer});
			socket.emit(item.function, {game: gameID, owner: uid, cardID: item.id, cardName: item.name, cardImage: item.image_url, next: nextPlayer});
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
		pullDeck.disabled = true;
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
	pullDeck.disabled = false;
	cardList.childNodes.forEach((element, index) => {
		element.childNodes[1].disabled = false;
	});
}

function disableCards() {
	pullDeck.disabled = true;
	cardList.childNodes.forEach((element, index) => {
		if (element.childNodes[0].textContent != "Nope") {
			element.childNodes[1].disabled = true;
		}
	});
}

function findIfTurn(item, turnsToPlay) {
	if (uid == item.next) {
		turn.innerHTML = "Your Turn";
		enableCards();
		toPlay.value = turnsToPlay;
	} else {
		turn.innerHTML = "Enemy Turn";
		disableCards();
	}
}

async function findIfOwnDefuse() {
	var found = false;
	await cardList.childNodes.forEach((element, index) => {
		if (element.childNodes[0].textContent == "Defuse") {
			found = true;
		}
	});
	return found;
}

async function playerDead(info) {
	explode.innerHTML = info.uname + " EXPLODED!";
	if (uid == info.owner) {
		explode.innerHTML = "You LOST!";
		await cardList.childNodes.forEach((element) => {
			putDownCard({cardID: element.id, cardName: element.childNodes[0].getAttribute("name")});
		});
		toPlay.value = 1;
		var data = {game: gameID, owner: uid, next: nextPlayer};
		socket.emit("/playSkip", data);
	}
}

function removePlayer() {
	var url = "/game/removePlayer/"+gameID+"/"+info.owner;
	getResponse(url, function(jason) { return; });
}

function disableButDefuse(item) {
	pullDeck.disabled = true;
	cardList.childNodes.forEach((element, index) => {
		if (element.childNodes[0].textContent != "Defuse") {
			element.childNodes[1].disabled = true;
		} 
	});
}

function createForm() {
	var newForm = document.createElement('form');
	newForm.className = "shuffleForm";
	locationDiv.appendChild(newForm);
	var newHeader = document.createElement('label');
	newHeader.textContent = "Where Shoud the Exploding Kitten be Placed?";
	newForm.appendChild(newHeader);
	var breaku = document.createElement('br');
	newForm.appendChild(breaku);
	var newInput = document.createElement('input');
	newInput.type = "radio";
	newInput.setAttribute("name", "top");
	newInput.value = 0;
	newForm.appendChild(newInput);
	var newLabel = document.createElement('label');
	newLabel.setAttribute("for", "top");
	newLabel.textContent = "On Top";
	newForm.appendChild(newLabel);
	breaku = document.createElement('br');
	newForm.appendChild(breaku);
	newInput = document.createElement('input');
	newInput.type = "radio";
	newInput.setAttribute("name", "two");
	newInput.value = 1;
	newForm.appendChild(newInput);
	newLabel = document.createElement('label');
	newLabel.setAttribute("for", "two");
	newLabel.textContent = "Top Two";
	newForm.appendChild(newLabel);
	breaku = document.createElement('br');
	newForm.appendChild(breaku);
	newInput = document.createElement('input');
	newInput.type = "radio";
	newInput.setAttribute("name", "three");
	newInput.value = 2;
	newForm.appendChild(newInput);
	newLabel = document.createElement('label');
	newLabel.setAttribute("for", "three");
	newLabel.textContent = "Top Three";
	newForm.appendChild(newLabel);
	breaku = document.createElement('br');
	newForm.appendChild(breaku);
	newInput = document.createElement('input');
	newInput.type = "radio";
	newInput.setAttribute("name", "four");
	newInput.value = 3;
	newForm.appendChild(newInput);
	newLabel = document.createElement('label');
	newLabel.setAttribute("for", "four");
	newLabel.textContent = "Top Four";
	newForm.appendChild(newLabel);
	breaku = document.createElement('br');
	newForm.appendChild(breaku);
	newInput = document.createElement('input');
	newInput.type = "radio";
	newInput.setAttribute("name", "five");
	newInput.value = 4;
	newForm.appendChild(newInput);
	newLabel = document.createElement('label');
	newLabel.setAttribute("for", "five");
	newLabel.textContent = "Top Five";
	newForm.appendChild(newLabel);
	breaku = document.createElement('br');
	newForm.appendChild(breaku);
	newInput = document.createElement('input');
	newInput.type = "radio";
	newInput.setAttribute("name", "middle");
	newInput.value = -1;
	newForm.appendChild(newInput);
	newLabel = document.createElement('label');
	newLabel.setAttribute("for", "middle");
	newLabel.textContent = "Middle of Deck";
	newForm.appendChild(newLabel);
	breaku = document.createElement('br');
	newForm.appendChild(breaku);
	newInput = document.createElement('input');
	newInput.type = "radio";
	newInput.setAttribute("name", "end");
	newInput.value = -2;
	newForm.appendChild(newInput);
	newLabel = document.createElement('label');
	newLabel.setAttribute("for", "end");
	newLabel.textContent = "Bottom of Deck";
	newForm.appendChild(newLabel);
	breaku = document.createElement('br');
	newForm.appendChild(breaku);
	newInput = document.createElement('input');
	newInput.type = "submit";
	newInput.setAttribute("name", "reshuffle");
	newInput.value = "Confirm";
	newForm.appendChild(newInput);
	newForm.addEventListener('submit', function(e) {
		e.preventDefault();
		getChecked(function(indexChosen) {
			if (indexChosen != -3) {
				var url = "/game/reshuffleExplode/"+gameID+"/"+indexChosen;
				getResponse(url, function(jason) {
					enableCards();
					locationDiv.removeChild(locationDiv.childNodes[0])
				});
			}
		});
	});
}

async function getChecked(next) {
	var indexChosen = -3;
	await locationDiv.childNodes[0].childNodes.forEach((element, index) => {
		if (element.checked) {
			indexChosen = element.value;
		}
	});
	next(indexChosen);
}


const deck = document.getElementById("deck");

deck.addEventListener('submit', function(e) {
	e.preventDefault();
	var url = "/game/deck/"+gameID;
	getResponse(url, async function(jason) {
		if (jason.function == "/playExplode") {
			jason["cardID"] = jason.id;
			putDownCard(jason);
			var url = "/game/playCard/"+gameID+"/"+jason.id;
			getResponse(url, async function(useless) {
				if (await findIfOwnDefuse()) {
					socket.emit(jason.function, {game: gameID, owner: uid, cardID: jason.id, cardName: jason.name, cardImage: jason.image_url, next: uid});
				} else {
					socket.emit("/playerExploded", {game: gameID, owner: uid, cardID: jason.id, cardName: jason.name, cardImage: jason.image_url, next: nextPlayer, uname: username});
				}
			});
		} else {
			addOwnCard(jason, 0);
			if (toPlay.value == 1) {
				socket.emit("/deck", {game: gameID, owner: uid, next: nextPlayer});
			} else {
				socket.emit("/deck", {game: gameID, owner: uid, next: uid});
			}
		}
	});
});

socket.on('/deck', function(ownerJason) {
	findIfTurn(ownerJason, 1);
	addEnemyCard(ownerJason, 0);
});

socket.on('/cardPlayed', function(ownerJason) {
	removeEnemyCard(ownerJason);
	putDownCard(ownerJason);
});

setTimeout(groupEnemyCards, 200);

socket.on('/playNope', function(ownerJason) {
	//do sometiong
});

socket.on('/playAttack', function(ownerJason) {
	findIfTurn(ownerJason, 2);
});

socket.on('/playSkip', function(ownerJason) {
	if (toPlay.value == 1) {
		findIfTurn(ownerJason, 1);
	} else {
		ownerJason["next"] = uid;
		findIfTurn(ownerJason, 1);
	}
});

socket.on('/playFavor', function(ownerJason) {
	//do sometiong
});

socket.on('/playShuffle', function(ownerJason) {
	//do sometiong
});

socket.on('/playSee', function(ownerJason) {
	//do sometiong
});

socket.on('/playSpecial', function(ownerJason) {
	//do sometiong
});

socket.on('/playExplode', function(ownerJason) {
	explode.innerHTML = "Exploding Kitten FOUND!";
	disableButDefuse(ownerJason);
});

socket.on('/playerExploded', function(ownerJason) {
	explode.innerHTML = "Exploding Kitten FOUND!";
	setTimeout(function() {
		playerDead(ownerJason);
		//removePlayer();
	}, 4000);
});

socket.on('/playDefuse', function(ownerJason) {
	explode.innerHTML = "";
	if (uid == ownerJason.owner) {
		disableCards();
		createForm();
	}
});

