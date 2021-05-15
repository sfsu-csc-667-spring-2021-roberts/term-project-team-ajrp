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
        imageURL: {
          type: Sequelize.STRING,
          allowNull: false
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true
        }
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('cards');
  }
};
