'use strict';

const { Model } = require('sequelize');

module.exports = function (sequelize, DataTypes) {
  class Transaction extends Model {
    static associate(models) {
      Transaction.belongsTo(models.Debt, { foreignKey: 'debt_id' });
      Transaction.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }

  Transaction.init({
    debt_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    type: DataTypes.ENUM('payment', 'additional_debt', 'adjustment'),
    amount: DataTypes.DECIMAL(15, 2),
    transaction_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    notes: DataTypes.TEXT
  }, {
    sequelize: sequelize,
    modelName: 'Transaction',
    tableName: 'transactions',
    underscored: true,
    updatedAt: false
  });

  return Transaction;
};