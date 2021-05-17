const db = require('./connection');
const lobbies = require('./lobbies');
const cards = require('./cards');

const createGame = (lobby_id, next) => {
  lobbies.countPlayers(lobby_id, function(playerCount) {
    var cardCount = playerCount - 1 + 52;
    var query = "INSERT INTO games (lobby_id, number_of_players, number_of_cards) VALUES ("+lobby_id+", "+playerCount+", "+cardCount+") RETURNING id;";
    db.one(query).then((info) => {
      console.log(info);
      cards.cardsSetup(info, playerCount, function() {
        console.log(info.id);
        next(info.id);
      });
    }).catch((error) => {
      console.log(error);
    });
  });
};

const joinGame = (game_id, next) => {
  var query = "SELECT lobby_id FROM games WHERE id = "+game_id+";";
  db.one(query).then((info) => {
    query = "SELECT game_name FROM lobbies WHERE id = "+info.lobby_id+";";
    db.one(query).then((name) => {
      next(name.game_name);
    }).catch((error) => {
      console.log(error);
    });
  }).catch((error) => {
    console.log(error);
  });
};

const getFirstCards = (player_id, game_id, next) => {
  var query = "UPDATE cards SET owner = "+player_id+" WHERE id IN (SELECT id FROM cards WHERE game_id = "+game_id+" AND name <> 'Exploding Kitten' ORDER BY deck_order LIMIT 4) RETURNING *";
  db.any(query).then((info) => {
    query = "UPDATE cards SET owner = "+player_id+" WHERE id IN (SELECT id FROM cards WHERE game_id = "+game_id+" AND name = 'Defuse' AND owner = -1 LIMIT 1) RETURNING *";
    db.one(query).then((defuseInfo) => {
      info.push(defuseInfo);
      next(info);
    }).catch((error) => {
      console.log(error);
    });
  }).catch((error) => {
    console.log(error);
  });
};

const playCard = (game_id, card_id, next) => {
  var query = "UPDATE cards SET owner = -2 WHERE id = (SELECT id FROM cards WHERE game_id = "+game_id+" AND id = "+card_id+")";
  db.none(query).then(() => {
    next();
  }).catch((error) => {
    console.log(error);
  });
};

const getPlayers = (lobby_id, next) => {
  var query = "SELECT player_id FROM lobbies_members WHERE lobby_id = "+lobby_id+";";
  db.many(query).then((results) => {
    next(results);
  }).catch((error) => {
    console.log(error);
  });
};

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
};

module.exports = { createGame, exitGame, getPlayers, joinGame, getFirstCards, playCard };
