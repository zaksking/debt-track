const express = require('express')

const router = express.Router()

const userController = require('../controllers/user.controller')
const auth = require('../middleware/auth')

router.post("/", userController.newUser)
router.get("/", userController.getAllUser)
router.put('/reset/:id', auth.authorize, auth.isAdmin, userController.ResetPassword)
router.put('/:id', auth.authorize, auth.isAdmin, userController.updateUser)
router.delete('/:id', auth.authorize, auth.isAdmin, userController.deleteUser)
router.get('/:id', auth.authorize, auth.isAdmin, userController.getUserById)

module.exports = router