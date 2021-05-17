'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'games',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        lobby_id: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        game_name: {
          type: Sequelize.STRING,
          allowNull: false
        },
        number_of_players: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        number_of_cards: {
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
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('games');
  }
};