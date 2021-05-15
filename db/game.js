const db = require('./connection');
const lobbies = require('./lobbies');

const createGame = (lobby_id, next) => {
  lobbies.countPlayers(lobby_id, function(playerCount) {
    var query = "INSERT INTO games (lobby_id, number_of_players) VALUES ("+lobby_id+", '"+playerCount+"') RETURNING id;";
    db.one(query).then((info) => {
      next(info.id);
    }).catch((error) => {
      console.log(error);
    });
  });
}

const exitGame = (player_id, game_id, next) => {
  db.none("DELETE FROM lobbies_members WHERE player_id = "+player_id+"")
  .then(() => {
    db.one("SELECT number_of_players FROM games WHERE id = "+game_id+"")
    .then((info) => {
      var newNum = info.number_of_players - 1;
      if (newNum === 0) {
        db.none("DELETE FROM games WHERE id = "+game_id+"")
        .then(() => {
          next();
        })
      } else {
        db.none("UPDATE games SET number_of_players = "+newNum+" WHERE id = "+game_id+"")
        .then(() => {
          next();
        })
      }
    }).catch((error) => {
      console.log(error);
    })
  }).catch((error) => {
    console.log(error);
  });
}

const countPlayers = () => {
  return db.one(
    'COUNT (*) FROM lobbies GROUP BY game_id'
  )
}

module.exports = { createGame, exitGame, countPlayers };
