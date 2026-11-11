'use strict';

const { Model } = require('sequelize');

module.exports = function (sequelize, DataTypes) {
  class Debtor extends Model {
    static associate(models) {
      Debtor.belongsTo(models.User, { foreignKey: 'user_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
      Debtor.hasMany(models.Debt, { foreignKey: 'debtor_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    }
  }

  Debtor.init({
    user_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    address: DataTypes.TEXT,
    notes: DataTypes.TEXT
  }, {
    sequelize: sequelize,
    modelName: 'Debtor',
    tableName: 'debtors',
    underscored: true
  });

  return Debtor;
};