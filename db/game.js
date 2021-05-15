const db = require('./connection');
const lobbies = require('./lobbies');

const createGame = (player_id, lobby_id, next) => {
  var playerCount = lobbies.countPlayers();
  var query = "INSERT INTO games (lobby_id, number_of_players) VALUES ("+lobby_id+", '"+playerCount+"') RETURNING id;";
  db.one(query).then((info) => {
    next({id: info.id, gameName: newName});
  }).catch((error) => {
    console.log(error);
  });
}

const allLobbies = () => {
  return db.any(
    'SELECT * FROM lobbies'
  )
}

const countPlayers = () => {
  return db.one(
    'COUNT (*) FROM lobbies GROUP BY game_id'
  )
}

<<<<<<< HEAD
module.exports = { createLobby, allLobbies };
=======
module.exports = { createGame, allLobbies, countPlayers };
>>>>>>> 6a67705649839b2e8f966006d4478223c5bf3347
