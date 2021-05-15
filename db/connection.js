const pgp = require('pg-promise')();
const QueryFile = pgp.QueryFile;
const path = require('path');

console.log("database url ", process.env.DATABASE_URL);

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const connection = pgp(process.env.DATABASE_URL);

/*
var query = "INSERT INTO cards (name, \"imageURL\") VALUES ('Defuse', 'images/defuse-card'), ('Nope', 'images/nope-card'), ('Exploding Kitten', 'images/explode-card'), ('Attack', 'images/attack-card'), ('Skip', 'images/skip-card'), ('Favor', 'images/favor-card'), ('Shuffle', 'images/shuffle-card'), ('See The Future', 'images/see-card'), ('Momma Cat', 'images/momma-card'), ('Beard Cat', 'images/beard-card'), ('Bikini Cat', 'images/bikini-card'), ('Tacocat', 'images/tacocat-card'), ('Zombie Cat', 'images/zombie-card');";
console.log(query);
connection.none(query).catch(error => {
	console.log("ERROR:", error.message || error);
});
*/

module.exports = connection;


