
'use strict';

const { Model } = require('sequelize');

module.exports = function (sequelize, DataTypes) {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Debtor, { foreignKey: 'user_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
      User.hasMany(models.Debt, { foreignKey: 'user_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
      User.hasMany(models.Transaction, { foreignKey: 'user_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    }
  }

  User.init({
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password_hash: DataTypes.STRING,
    full_name: DataTypes.STRING,
    role: {
      type: DataTypes.ENUM('user', 'admin'),
      allowNull: false,
      defaultValue: 'user'
    }
  }, {
    sequelize: sequelize,
    modelName: 'User',
    tableName: 'users',
    underscored: true
  });

  return User;
};
