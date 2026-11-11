const { sequelize, Debt, Transaction } = require('../models')

exports.newTransaction = async (request, response) => {
    try {
        const debt = await Debt.findByPk(request.body.debt_id)

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
    Transaction.findAll()
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
    Transaction.findOne({where:{id:transaction_id}})
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
    let transaction_id = request.params.id
    Transaction.destroy({where:{id:transaction_id}})
    .then(result => {
        if(result === 0) {
            return response.json({
                success:false,
                message: "Transaction not found"
            })
        }
        return response.json({
            success: true,
            message: "Transaction has deleted"
        })
    })
    .catch(error => {
        return response.json({
            success: false,
            message: error.message
        })
    })
}