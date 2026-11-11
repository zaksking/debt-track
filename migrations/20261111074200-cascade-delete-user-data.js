'use strict';

async function setDeleteAction(queryInterface, tableName, columnName, onDelete) {
  const foreignKeys = await queryInterface.getForeignKeyReferencesForTable(tableName);
  const foreignKey = foreignKeys.find(key => key.columnName === columnName);

  if (!foreignKey) {
    throw new Error(`Foreign key for ${tableName}.${columnName} was not found`);
  }

  await queryInterface.removeConstraint(tableName, foreignKey.constraintName);
  await queryInterface.addConstraint(tableName, {
    fields: [columnName],
    type: 'foreign key',
    name: foreignKey.constraintName,
    references: {
      table: foreignKey.referencedTableName,
      field: foreignKey.referencedColumnName
    },
    onUpdate: 'CASCADE',
    onDelete
  });
}

module.exports = {
  async up(queryInterface) {
    await setDeleteAction(queryInterface, 'debtors', 'user_id', 'CASCADE');
    await setDeleteAction(queryInterface, 'debts', 'debtor_id', 'CASCADE');
    await setDeleteAction(queryInterface, 'debts', 'user_id', 'CASCADE');
    await setDeleteAction(queryInterface, 'transactions', 'debt_id', 'CASCADE');
    await setDeleteAction(queryInterface, 'transactions', 'user_id', 'CASCADE');
  },

  async down(queryInterface) {
    await setDeleteAction(queryInterface, 'transactions', 'user_id', 'RESTRICT');
    await setDeleteAction(queryInterface, 'transactions', 'debt_id', 'RESTRICT');
    await setDeleteAction(queryInterface, 'debts', 'user_id', 'RESTRICT');
    await setDeleteAction(queryInterface, 'debts', 'debtor_id', 'RESTRICT');
    await setDeleteAction(queryInterface, 'debtors', 'user_id', 'RESTRICT');
  }
};
