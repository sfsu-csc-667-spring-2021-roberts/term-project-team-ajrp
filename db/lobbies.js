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
  var query = "UPDATE lobbies_members SET next = "+player_id+" WHERE lobby_id = "+lobby_id+" AND next = 0 RETURNING player_id;";
  db.oneOrNone(query).then((lastAdd) => {
    if (lastAdd) {
      query = "INSERT INTO lobbies_members (player_id, lobby_id, next, previous) VALUES ("+player_id+", '"+lobby_id+"', 0, "+lastAdd.player_id+");";
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
    } else {
      query = "INSERT INTO lobbies_members (player_id, lobby_id, next, previous) VALUES ("+player_id+", '"+lobby_id+"', 0, 0);";
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
    }
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

const getMembers = (lobby_id, next) => {
  var query = "SELECT username FROM users WHERE id IN (SELECT player_id FROM lobbies_members WHERE lobby_id = "+lobby_id+");";
  db.many(query).then((info) => {
    next(info);
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

const sealLobby = (lobby_id, next) => {
  var query = "SELECT player_id FROM lobbies_members WHERE lobby_id = "+lobby_id+" AND next = 0;";
  db.one(query).then((lastAdd) => {
    query = "SELECT player_id FROM lobbies_members WHERE lobby_id = "+lobby_id+" AND previous = 0;";
    db.one(query).then((firstAdd) => {
      query = "UPDATE lobbies_members SET next = "+firstAdd.player_id+" WHERE lobby_id = "+lobby_id+" AND next = 0;";
      db.none(query).then(() => {
        query = "UPDATE lobbies_members SET previous = "+lastAdd.player_id+" WHERE lobby_id = "+lobby_id+" AND previous = 0;";
        db.none(query).then(() => {
          next();
        }).catch((error) => {
          console.log(error);
        });
      }).catch((error) => {
        console.log(error);
      });
    }).catch((error) => {
      console.log(error);
    });
  }).catch((error) => {
    console.log(error);
  });
};


const exitLobby = (player_id, lobby_id, next) => {
  db.none("DELETE FROM lobbies_members WHERE player_id = "+player_id+"")
  .then(() => {
    countPlayers(lobby_id, function(number_of_players) {
      if (number_of_players == 0) {
        removeLobby(lobby_id, function() {
          next();
        });
      } else {
        next();
      }
    });
  }).catch((error) => {
    console.log(error);
  });
};

module.exports = { createLobby, allLobbies, countPlayers, joinLobby, removeLobby, sealLobby, exitLobby, getMembers };