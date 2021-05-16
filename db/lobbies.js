const db = require('./connection');

const createLobby = (player_id, username, next) => {
  var newName = "Game of "+username;
  var query = "INSERT INTO lobbies (player_id, game_name) VALUES ("+player_id+", '"+newName+"') RETURNING id;";
  db.one(query).then((info) => {
    next({id: info.id, gameName: newName});
  }).catch((error) => {
    console.log(error);
  })
}

const allLobbies = () => {
  return db.any(
    'SELECT * FROM lobbies'
  );
}

const countPlayers = (lobby_id, next) => {
  var query = "SELECT COUNT(*) FROM lobbies_members WHERE lobby_id = "+lobby_id+";";
  db.one(query).then((info) => {
    console.log(info);
    next(info.count);
  }).catch((error) => {
    console.log(error);
  });
}

module.exports = { createLobby, allLobbies, countPlayers };