const debtController = require('../controllers/debt.controller')
const express = require('express')
const router = express.Router()

router.post('/', debtController.addNewDebt)
router.get('/', debtController.getAllDebts)
router.put('/:id', debtController.updateDebts)
router.delete('/:id',debtController.deleteDebt)

module.exports = router