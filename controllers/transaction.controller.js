const { sequelize, Debt, Transaction } = require('../models')

function getOwnerFilter(request) {
    return request.user.role === 'admin' ? {} : { user_id: request.user.user_id }
}

exports.newTransaction = async (request, response) => {
    try {
        const debt = await Debt.findOne({
            where: {
                id: request.body.debt_id,
                ...getOwnerFilter(request)
            }
        })
        if (!debt) {
            return response.status(404).json({
                success: false,
                message: 'Utang tidak ditemukan'
            })
        }

        const amount = Number(request.body.amount)
        const remaining = Number(debt.remaining_amount)

        if (!Number.isFinite(amount) || amount <= 0) {
            return response.status(400).json({
                success: false,
                message: 'amount harus lebih dari 0'
            })
        }

        if (amount > remaining) {
            return response.status(400).json({
                success: false,
                message: 'Pembayaran melebihi sisa utang'
            })
        }

        const newRemaining = remaining - amount

        const transaction = await sequelize.transaction(async (t) => {
            const baru = await Transaction.create({
                debt_id: debt.id,
                user_id: debt.user_id,
                type: 'payment',
                amount: amount,
                notes: request.body.notes
            }, { transaction: t })

            await debt.update({
                remaining_amount: newRemaining,
                status: newRemaining === 0 ? 'paid' : 'partial'
            }, { transaction: t })

            return baru
        })

        return response.json({
            success: true,
            data: {
                transaction: transaction,
                remaining_amount: newRemaining,
                status: newRemaining === 0 ? 'paid' : 'partial'
            }
        })
    } catch (error) {
        return response.status(500).json({
            success: false,
            message: error.message
        })
    }   
}

exports.getAllTransaction = async(request, response) => {
    Transaction.findAll({ where: getOwnerFilter(request) })
    .then(result => {
        return response.json({
            success: true,
            data: result,
            message: "All data has loaded"
        })
    })
    .catch(error => {
        return response.json({
            success: false,
            message: error.message
        })
    })
}

exports.getTransactionById = async(request, response) => {
    let transaction_id = request.params.id
    Transaction.findOne({
        where: { id: transaction_id, ...getOwnerFilter(request) }
    })
    .then(result => {
        if (result) {
            return response.json({
            success: true,
            data: result,
            message: "Transaction found"
        })
        }else{
            return response.json({
                success: false,
                message: "Transaction not found"
            })
        }
    })
    .catch(error => {
        return response.json({
            success: false,
            message: error.message
        })
    })
}

exports.deleteTransaction = async(request, response) => {
    try {
        const result = await sequelize.transaction(async (t) => {
            const transaction = await Transaction.findOne({
                where: {
                    id: request.params.id,
                    ...getOwnerFilter(request)
                },
                transaction: t,
                lock: t.LOCK.UPDATE
            })

            if (!transaction) {
                return null
            }

            if (transaction.type !== 'payment') {
                throw new Error('Hanya transaksi pembayaran yang dapat dibatalkan')
            }

            const debt = await Debt.findByPk(transaction.debt_id, {
                transaction: t,
                lock: t.LOCK.UPDATE
            })

            if (!debt) {
                throw new Error('Utang transaksi tidak ditemukan')
            }

            const newRemaining = Number(debt.remaining_amount) + Number(transaction.amount)
            const status = newRemaining >= Number(debt.initial_amount)
                ? 'unpaid'
                : 'partial'

            await debt.update({
                remaining_amount: newRemaining,
                status
            }, { transaction: t })

            await transaction.destroy({ transaction: t })
            return true
        })

        if (!result) {
            return response.json({
                success: false,
                message: 'Transaction not found'
            })
        }

        return response.json({
            success: true,
            message: 'Transaction deleted and debt balance restored'
        })
    } catch (error) {
        return response.json({
            success: false,
            message: error.message
        })
    }
}

exports.updateTransaction = async (request, response) => {
    const amount = Number(request.body.amount)

    if (!Number.isFinite(amount) || amount <= 0) {
        return response.status(400).json({
            success: false,
            message: 'amount harus lebih dari 0'
        })
    }

    try {
        const result = await sequelize.transaction(async (t) => {
            const transaction = await Transaction.findOne({
                where: {
                    id: request.params.id,
                    ...getOwnerFilter(request)
                },
                transaction: t,
                lock: t.LOCK.UPDATE
            })

            if (!transaction) {
                return null
            }

            if (transaction.type !== 'payment') {
                throw new Error('Hanya transaksi pembayaran yang dapat diubah')
            }

            const debt = await Debt.findByPk(transaction.debt_id, {
                transaction: t,
                lock: t.LOCK.UPDATE
            })

            if (!debt) {
                throw new Error('Utang transaksi tidak ditemukan')
            }

            const newRemaining = Number(debt.remaining_amount)
                + Number(transaction.amount)
                - amount

            if (newRemaining < 0) {
                throw new Error('Pembayaran melebihi sisa utang')
            }

            const status = newRemaining === 0
                ? 'paid'
                : newRemaining >= Number(debt.initial_amount)
                    ? 'unpaid'
                    : 'partial'

            await transaction.update({
                amount,
                notes: request.body.notes
            }, { transaction: t })

            await debt.update({
                remaining_amount: newRemaining,
                status
            }, { transaction: t })

            return { transaction, remaining_amount: newRemaining, status }
        })

        if (!result) {
            return response.status(404).json({
                success: false,
                message: 'Transaction not found'
            })
        }

        return response.json({ success: true, data: result })
    } catch (error) {
        return response.status(400).json({
            success: false,
            message: error.message
        })
    }
}