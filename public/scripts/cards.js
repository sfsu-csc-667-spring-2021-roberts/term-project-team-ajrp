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
var toPlay = document.getElementById('toPlay').value;

async function getResponse(url, next) {
	let res = await fetch(url);
	let jason = await res.json();
	next(jason);
}

socket.on('/playNope', function(ownerJason) {
	//do sometiong
});

socket.on('/playAttack', function(ownerJason) {
	turn.innerHTML = "Enemy Turn";
	disableCards();
	findIfTurn(ownerJason, 2);
});

socket.on('/playSkip', function(ownerJason) {
	if (toPlay.value == 1) {
		turn.innerHTML = "Enemy Turn";
		disableCards();
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
	//do sometiong
});

socket.on('/playDefuse', function(ownerJason) {
	//do sometiong
});




