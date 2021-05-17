const db = require('./connection');

const createLobby = (player_id, username, next) => {
  var newName = "Game of "+username;
  var query = "INSERT INTO lobbies (owner_id, game_name) VALUES ("+player_id+", '"+newName+"') RETURNING id;";
  db.one(query).then((info) => {
    next(info);
  }).catch((error) => {
    console.log(error);
  })
};

const joinLobby = (player_id, lobby_id, next) => {
  var query = "INSERT INTO lobbies_members (player_id, lobby_id) VALUES ("+player_id+", '"+lobby_id+"');";
  db.none(query).then(() => {
    query = "SELECT game_name FROM lobbies WHERE id = "+lobby_id+";";
    db.one(query).then((name) => {
      next(name);
    }).catch((error) => {
      console.log(error);
    });
  }).catch((error) => {
    console.log(error);
  });
};

const allLobbies = (next) => {
  var query = "SELECT lobbies.id, lobbies.owner_id, lobbies.game_name, lobbies.create_at, U.username FROM lobbies LEFT JOIN (SELECT id, username FROM users) AS U ON U.id = lobbies.owner_id;";
  db.any(query).then((info) => {
    next(info);
  }).catch((error) => {
    console.log(error);
  });
}

const countPlayers = (lobby_id, next) => {
  var query = "SELECT COUNT(*) FROM lobbies_members WHERE lobby_id = "+lobby_id+";";
  db.one(query).then((info) => {
    next(info.count);
  }).catch((error) => {
    console.log(error);
  });
}

const removeLobby = (lobby_id, next) => {
  db.none("DELETE FROM lobbies WHERE id = "+lobby_id+"").then(() => {
    next();
  }).catch((error) => {
    console.log(error);
  });
}

module.exports = { createLobby, allLobbies, countPlayers, joinLobby, removeLobby };