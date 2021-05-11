const db = require('./connection');

const createLobby = (player_id) => {
  return db.none(
    'INSERT INTO lobbies (player_id) VALUES ($1)', [
    player_id
  ]);
}

const allLobbies = () => {
  return db.any(
    'SELECT * FROM lobbies'
  )
}

const countPlayers = () => {
  return db.one(
    'COUNT (*) FROM lobbies'
  )
}

module.exports = { createLobby, allLobbies };