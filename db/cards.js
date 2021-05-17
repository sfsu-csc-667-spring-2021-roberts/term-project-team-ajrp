const db = require('./connection');


function shuffle(array) {
	var tmp, current, top = array.length;
	if(top) while(--top) {
		current = Math.floor(Math.random() * (top + 1));
		tmp = array[current];
		array[current] = array[top];
		array[top] = tmp;
	}
	return array;
}

const cardsSetup = (info, playerCount, next) => {
	var randomArray = [];
	var totalCount = playerCount - 1 + 52;
	if (playerCount === 0) {
		totalCount = 52;
	}
	for (var i = 0; i <= totalCount; i++) {
		randomArray[i]=i;
	}
	randomArray = shuffle(randomArray);
	explodeString = " ";
	var counter = 0;
	for (var i = 0; i < playerCount-1; i++) {
		explodeString += "("+info.id+", 'Exploding Kitten', 'images/explode-card', '/playExplode', -1, "+randomArray[counter++]+"), ";
	}
	var query = "INSERT INTO cards (game_id, name, image_url, function, owner, deck_order) VALUES ("+info.id+", 'Nope', 'images/nope-card', '/playNope', -1, "+randomArray[counter++]+"), ("+info.id+", 'Nope', 'images/nope-card', '/playNope', -1, "+randomArray[counter++]+"), ("+info.id+", 'Nope', 'images/nope-card', '/playNope', -1, "+randomArray[counter++]+"), ("+info.id+", 'Nope', 'images/nope-card', '/playNope', -1, "+randomArray[counter++]+"), ("+info.id+", 'Nope', 'images/nope-card', '/playNope', -1, "+randomArray[counter++]+"), ("+info.id+", 'Attack', 'images/attack-card', '/playAttack', -1, "+randomArray[counter++]+"), ("+info.id+", 'Attack', 'images/attack-card', '/playAttack', -1, "+randomArray[counter++]+"), ("+info.id+", 'Attack', 'images/attack-card', '/playAttack', -1, "+randomArray[counter++]+"), ("+info.id+", 'Attack', 'images/attack-card', '/playAttack', -1, "+randomArray[counter++]+"), ("+info.id+", 'Skip', 'images/skip-card', '/playSkip', -1, "+randomArray[counter++]+"), ("+info.id+", 'Skip', 'images/skip-card', '/playSkip', -1, "+randomArray[counter++]+"), ("+info.id+", 'Skip', 'images/skip-card', '/playSkip', -1, "+randomArray[counter++]+"), ("+info.id+", 'Skip', 'images/skip-card', '/playSkip', -1, "+randomArray[counter++]+"), ("+info.id+", 'Favor', 'images/favor-card', '/playFavor', -1, "+randomArray[counter++]+"), ("+info.id+", 'Favor', 'images/favor-card', '/playFavor', -1, "+randomArray[counter++]+"), ("+info.id+", 'Favor', 'images/favor-card', '/playFavor', -1, "+randomArray[counter++]+"), ("+info.id+", 'Favor', 'images/favor-card', '/playFavor', -1, "+randomArray[counter++]+"), ("+info.id+", 'Shuffle', 'images/shuffle-card', '/playShuffle', -1, "+randomArray[counter++]+"), ("+info.id+", 'Shuffle', 'images/shuffle-card', '/playShuffle', -1, "+randomArray[counter++]+"), ("+info.id+", 'Shuffle', 'images/shuffle-card', '/playShuffle', -1, "+randomArray[counter++]+"), ("+info.id+", 'Shuffle', 'images/shuffle-card', '/playShuffle', -1, "+randomArray[counter++]+"), ("+info.id+", 'See The Future', 'images/see-card', '/playSee', -1, "+randomArray[counter++]+"), ("+info.id+", 'See The Future', 'images/see-card', '/playSee', -1, "+randomArray[counter++]+"), ("+info.id+", 'See The Future', 'images/see-card', '/playSee', -1, "+randomArray[counter++]+"), ("+info.id+", 'See The Future', 'images/see-card', '/playSee', -1, "+randomArray[counter++]+"), ("+info.id+", 'See The Future', 'images/see-card', '/playSee', -1, "+randomArray[counter++]+"), ("+info.id+", 'Momma Cat', 'images/momma-card', '/playSpecial', -1, "+randomArray[counter++]+"), ("+info.id+", 'Momma Cat', 'images/momma-card', '/playSpecial', -1, "+randomArray[counter++]+"), ("+info.id+", 'Momma Cat', 'images/momma-card', '/playSpecial', -1, "+randomArray[counter++]+"), ("+info.id+", 'Momma Cat', 'images/momma-card', '/playSpecial', -1, "+randomArray[counter++]+"), ("+info.id+", 'Bikini Cat', 'images/bikini-card', '/playSpecial', -1, "+randomArray[counter++]+"), ("+info.id+", 'Bikini Cat', 'images/bikini-card', '/playSpecial', -1, "+randomArray[counter++]+"), ("+info.id+", 'Bikini Cat', 'images/bikini-card', '/playSpecial', -1, "+randomArray[counter++]+"), ("+info.id+", 'Bikini Cat', 'images/bikini-card', '/playSpecial', -1, "+randomArray[counter++]+"), ("+info.id+", 'Zombie Cat', 'images/zombie-card', '/playSpecial', -1, "+randomArray[counter++]+"), ("+info.id+", 'Zombie Cat', 'images/zombie-card', '/playSpecial', -1, "+randomArray[counter++]+"), ("+info.id+", 'Zombie Cat', 'images/zombie-card', '/playSpecial', -1, "+randomArray[counter++]+"), ("+info.id+", 'Zombie Cat', 'images/zombie-card', '/playSpecial', -1, "+randomArray[counter++]+"), ("+info.id+", 'Tacocat', 'images/tacocat-card', '/playSpecial', -1, "+randomArray[counter++]+"), ("+info.id+", 'Tacocat', 'images/tacocat-card', '/playSpecial', -1, "+randomArray[counter++]+"), ("+info.id+", 'Tacocat', 'images/tacocat-card', '/playSpecial', -1, "+randomArray[counter++]+"), ("+info.id+", 'Tacocat', 'images/tacocat-card', '/playSpecial', -1, "+randomArray[counter++]+"), ("+info.id+", 'Defuse', 'images/defuse-card', '/playDefuse', -1, "+randomArray[counter++]+"), ("+info.id+", 'Defuse', 'images/defuse-card', '/playDefuse', -1, "+randomArray[counter++]+"), ("+info.id+", 'Defuse', 'images/defuse-card', '/playDefuse', -1, "+randomArray[counter++]+"), ("+info.id+", 'Defuse', 'images/defuse-card', '/playDefuse', -1, "+randomArray[counter++]+"), ("+info.id+", 'Defuse', 'images/defuse-card', '/playDefuse', -1, "+randomArray[counter++]+"), ("+info.id+", 'Defuse', 'images/defuse-card', '/playDefuse', -1, "+randomArray[counter++]+"), "+explodeString+"("+info.id+", 'Beard Cat', 'images/beard-card', '/playSpecial', -1, "+randomArray[counter++]+"), ("+info.id+", 'Beard Cat', 'images/beard-card', '/playSpecial', -1, "+randomArray[counter++]+"), ("+info.id+", 'Beard Cat', 'images/beard-card', '/playSpecial', -1, "+randomArray[counter++]+"), ("+info.id+", 'Beard Cat', 'images/beard-card', '/playSpecial', -1, "+randomArray[counter++]+");";
	db.none(query).then(() => {
		console.log("in here");
        next();
      }).catch((error) => {
        console.log(error);
      });
}

module.exports = {cardsSetup};