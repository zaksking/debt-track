const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')

router.post('/', auth.getToken)
router.get('/check', auth.authorize, (request, response) => {
    return response.json({
        success: true,
        message: 'Token valid',
        user_id: request.user.user_id
    })
})

module.exports = router