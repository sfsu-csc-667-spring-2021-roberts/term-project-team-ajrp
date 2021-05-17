'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'cards',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true, 
          autoIncrement: true
        },
        image_url: {
          type: Sequelize.STRING,
          allowNull: false
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false
        },
        function: {
          type: Sequelize.STRING,
          allowNull: false
        },
        owner: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        deck_order: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        game_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'games',
            key: 'id'
          }
        }
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('cards');
  }
};
