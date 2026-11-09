const express = require('express')

const router = express.Router()

const transactionController = require('../controllers/transaction.controller')

router.post('/', transactionController.newTransaction)
router.get('/', transactionController.getAllTransaction)
router.get('/:id', transactionController.getTransactionById)
router.delete('/:id', transactionController.deleteTransaction)


module.exports = router 