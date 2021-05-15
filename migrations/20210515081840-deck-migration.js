'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'deck',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true, 
          autoIncrement: true
        },
        game_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'games',
            key: 'id'
          }
        },
        card_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'cards',
            key: 'id'
          }
        }
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('deck');
  }
};
