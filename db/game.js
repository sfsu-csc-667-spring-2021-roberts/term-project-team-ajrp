const db = require('./connection');
const lobbies = require('./lobbies');
const cards = require('./cards');

const createGame = (lobby_id, game_name, next) => {
  lobbies.countPlayers(lobby_id, function(playerCount) {
    lobbies.removeLobby(lobby_id, function() {
      lobbies.sealLobby(lobby_id, function() {
        var cardCount = playerCount - 1 + 52;
        var query = "INSERT INTO games (lobby_id, number_of_players, number_of_cards, game_name) VALUES ("+lobby_id+", "+playerCount+", "+cardCount+", '"+game_name+"') RETURNING id;";
        db.one(query).then((info) => {
          cards.cardsSetup(info, 10
            , function() {
            next(info.id);
          });
        }).catch((error) => {
          console.log(error);
        });
      });
    });
  });
};

const joinGame = (game_id, next) => {
  var query = "SELECT game_name FROM games WHERE id = "+game_id+";";
  db.one(query).then((info) => {
    next(info.game_name);
  }).catch((error) => {
    console.log(error);
  });
};

const getFirstCards = (player_id, game_id, next) => {
  var query = "UPDATE cards SET owner = "+player_id+" WHERE id IN (SELECT id FROM cards WHERE game_id = "+game_id+" AND name <> 'Exploding Kitten' AND name <> 'Defuse' AND owner = -1 ORDER BY deck_order LIMIT 4) RETURNING *";
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

const reshuffleExplode = (game_id, option, next) => {
  cards.countRemaining(game_id, function(remaining) {
    var query = "SELECT number_of_cards FROM games WHERE id = "+game_id+";";
    db.one(query).then((numInfo) => {
      var position = option;
      if ((position == -2) || (position >= remaining)) {
        position = numInfo.number_of_cards;
      } else if (position == -1) {
        position = Math.floor(numInfo.number_of_cards/2);
      } else {
        position += (numInfo.number_of_cards-remaining-1)
      }
      cards.incrementFrom(game_id, position, function() {
        cards.addExplode(game_id, position, function() {
          query = "UPDATE games SET number_of_cards = number_of_cards + 1 WHERE id = "+game_id+";";
          db.none(query).then(() => {
            next();
          }).catch((error) => {
            console.log(error);
          });
        })
      });
    }).catch((error) => {
      console.log(error);
    });
  })
};

const deck = (player_id, game_id, next) => {
  var query = "UPDATE cards SET owner = "+player_id+" WHERE id = (SELECT id FROM cards WHERE game_id = "+game_id+" AND owner = -1 ORDER BY deck_order LIMIT 1) RETURNING *";
  db.one(query).then((info) => {
    next(info);
  }).catch((error) => {
    console.log(error);
  });
};

const getEnemyCards = (player_id, game_id, next) => {
  var query = "SELECT owner FROM cards WHERE game_id = "+game_id+" AND owner <> -1 AND owner <> -2 AND owner <> "+player_id+"";
  db.many(query).then((info) => {
    next(info);
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

const getPlayers = (player_id, game_id, next) => {
  var query = "SELECT * FROM lobbies_members WHERE lobby_id = (SELECT lobby_id FROM games WHERE id = "+game_id+") AND next <> -1;";
  db.many(query).then((results) => {
    next(results);
  }).catch((error) => {
    console.log(error);
  });
};

const removePlayer = (game_id, player_id, next) => {
  var query = "UPDATE lobbies_members SET next = sub.player_id FROM (SELECT player_id FROM lobbies_members WHERE lobby_id = "+game_id+" AND previous = "+player_id+") AS sub WHERE lobby_id = "+game_id+" AND next = "+player_id+" RETURNING lobbies_members.player_id;";
  db.one(query).then((info) => {
    query = "UPDATE lobbies_members SET previous = "+info.player_id+" WHERE lobby_id = "+game_id+" AND previous = "+player_id+";";
    db.none(query).then(() => {
      query = "UPDATE lobbies_members SET next = -1 WHERE lobby_id = "+game_id+" AND player_id = "+player_id+";";
      db.none(query).then(() => {
        next();
      }).catch((error) => {
        console.log(error);
      })
    }).catch((error) => {
      console.log(error);
    })
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
        cards.deleteCards(game_id, function() {
          db.none("DELETE FROM games WHERE id = "+game_id+";")
          .then(() => {
            next();
          })
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

module.exports = { createGame, exitGame, getPlayers, joinGame, getFirstCards, playCard, deck, getEnemyCards, reshuffleExplode, removePlayer };
