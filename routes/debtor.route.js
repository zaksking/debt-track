const express = require('express')

const router = express.Router()

const debtorController = require('../controllers/debtor.controller')

router.get("/", debtorController.getAllDebtors)
router.post("/", debtorController.newDebtor)
router.put('/:id', debtorController.updateDebtor)
router.delete('/:id', debtorController.deleteDebtor)
router.get('/:id', debtorController.getDebtorById)
router.get('/user/:id', debtorController.getDebtorByuserID)

module.exports = router
