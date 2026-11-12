const jwt = require('jsonwebtoken')
const { User } = require('../models')
const md5 = require('md5')
const secretKey = 'testing'

exports.getToken = async (request, response) => {
    const { email, password } = request.body

    if (!email || !password) {
        return response.status(400).json({
            success: false,
            message: 'Email dan password wajib diisi'
        })
    }

    try {
        const user = await User.findOne({ where: { email } })

        if (!user || user.password_hash !== md5(password)) {
            return response.status(401).json({
                success: false,
                message: 'Email atau password salah'
            })
        }

        const payload = {
            user_id: user.id,
            email: user.email,
            role: user.role
        }
        const token = jwt.sign(payload, secretKey, {
            expiresIn: '1d'
        })

        return response.json({
            success: true,
            message: 'Login berhasil',
            token
        })
    } catch (error) {
        return response.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.authorize = (request, response, next) => {
    const authHeader = request.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return response.status(401).json({
            success: false,
            message: 'Token tidak ditemukan'
        })
    }

    const token = authHeader.slice('Bearer '.length)

    try {
        const payload = jwt.verify(token, secretKey)

        if (!payload || typeof payload !== 'object' || !payload.user_id) {
            return response.status(401).json({
                success: false,
                message: 'Token tidak valid'
            })
        }

        request.user = payload
        return next()
    } catch (error) {
        return response.status(401).json({
            success: false,
            message: 'Token tidak valid atau sudah kedaluwarsa'
        })
    }
}

exports.isAdmin = (request, response, next) => {
    if (!request.user || request.user.role !== 'admin') {
        return response.status(403).json({
            success: false,
            message: 'Akses hanya untuk admin'
        })
    }

    return next()
}