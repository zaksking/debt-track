const express = require('express')

const router = express.Router()

const userController = require('../controllers/user.controller')

router.get("/", userController.getAllUser)
router.post("/", userController.newUser)
router.put('/:id', userController.updateUser)
router.delete('/:id', userController.deleteUser)
router.get('/:id', userController.getUserById)

module.exports = router