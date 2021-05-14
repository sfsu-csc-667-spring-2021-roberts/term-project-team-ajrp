const db = require('./connection');

//fix game_id
const createLobby = (lobbyName, player_id) => {
  return db.none(
    'INSERT INTO lobbies (game_name, player_id, game_id) VALUES ($1, $2, $3)', [
    lobbyName,
    player_id,
    2
  ]);
}

const allLobbies = () => {
  return db.any(
    'SELECT * FROM lobbies'
  );
}

const countPlayers = () => {
  return db.one(
    'COUNT (*) FROM lobbies'
  );
}

module.exports = { createLobby, allLobbies };