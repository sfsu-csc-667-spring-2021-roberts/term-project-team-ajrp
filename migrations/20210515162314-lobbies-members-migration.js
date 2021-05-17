'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'lobbies_members',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        player_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id'
          }
        },
        next: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        previous: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        lobby_id: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('lobbies_members');
  }
};
