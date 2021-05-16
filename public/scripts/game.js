const cardList = document.getElementById("cardOwn");
var gameID = document.getElementById('idInput').value;

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

async function getResponse(url, next) {
	let res = await fetch(url);
	let jason = await res.json();
	next(jason);
}

function getFirstCards() {
	getResponse("/game/getFirstCards/"+gameID, function(jason) {
		jason.forEach(addOwnCard);
	});
}

getFirstCards();





