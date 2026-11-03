'use strict';

const { Model } = require('sequelize');

module.exports = function (sequelize, DataTypes) {
  class Debt extends Model {
    static associate(models) {
      Debt.belongsTo(models.Debtor, { foreignKey: 'debtor_id' });
      Debt.belongsTo(models.User, { foreignKey: 'user_id' });
      Debt.hasMany(models.Transaction, { foreignKey: 'debt_id' });
    }
  }

  Debt.init({
    debtor_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    title: DataTypes.STRING,
    initial_amount: DataTypes.DECIMAL(15, 2),
    remaining_amount: DataTypes.DECIMAL(15, 2),
    description: DataTypes.TEXT,
    due_date: DataTypes.DATEONLY,
    status: {
      type: DataTypes.ENUM('unpaid', 'partial', 'paid', 'overdue'),
      defaultValue: 'unpaid'
    }
  }, {
    sequelize: sequelize,
    modelName: 'Debt',
    tableName: 'debts',
    underscored: true
  });

  return Debt;
};