'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('debts', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      debtor_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'debtors', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      title: {
        type: Sequelize.STRING(150),
        allowNull: false
      },
      initial_amount: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false
      },
      remaining_amount: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      due_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('unpaid', 'partial', 'paid', 'overdue'),
        allowNull: false,
        defaultValue: 'unpaid'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  down: function (queryInterface) {
    return queryInterface.dropTable('debts');
  }
};