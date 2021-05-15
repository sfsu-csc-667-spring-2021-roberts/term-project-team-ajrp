const db = require('./connection');
const lobbies = require('./lobbies');

const createGame = (player_id, lobby_id, next) => {
  var playerCount = lobbies.countPlayers();
  var query = "INSERT INTO games (lobby_id, number_of_players) VALUES ("+lobby_id+", '"+playerCount+"') RETURNING id;";
  db.one(query).then((info) => {
    next({id: info.id, gameName: newName});
  }).catch((error) => {
    console.log(error);
  })


        id: {
          type: Sequelize.INTEGER,
          primaryKey: true
        },
        lobby_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'lobbies',
            key: 'id'
          }
        },
        number_of_players: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        createAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('NOW()'),
          allowNull: false
        },
        ended: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        }
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

module.exports = { createLobby, allLobbies };