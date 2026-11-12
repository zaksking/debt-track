const {User} = require('../models')
const md5 = require('md5')

exports.newUser = (request,response) => {
    
    const role = request.body.role || 'user'
    if(!['user','admin'].includes(role)) {
        return response.status(400).json({
            success: false,
            message: "Role hanya boleh user atau admin"
        })
    }
    let newUser = {
        username: request.body.username,
        email: request.body.email,
        password_hash: md5(request.body.password),
        full_name: request.body.full_name,
        role: role
    }
    User.create(newUser)
    .then(result => {
        const userData = result.toJSON()
        delete userData.password_hash

        return response.json({
            success: true,
            data: userData,
            message: "User has created"
        })
    })
    .catch(error => {
        return response.json({
            success: false,
            message: error.message
        })
    })
}

exports.getAllUser = async(request, response) => {
    User.findAll()
    .then(result => {
        return response.json({
            success: true,
            data: result,
            message: 'All user has loaded'
        })
    })
    .catch(error => {
        return response.json({
            success: false,
            message: error.message
        })
    })
}

exports.getUserById = async(request,response) => {
    let user_id = request.params.id
    User.findOne({where: {id: user_id}, attributes: {exclude: ['password_hash']}})
    .then(result => {
        if (result) {
            return response.json({
                success: true,
                data: result,
                message: 'user found'
            })
        } else {
            return response.json({
                success: false,
                message: 'user not found'
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

exports.updateUser = async(request, response) => {
    const dataUser = {}

    if (request.body.username !== undefined) {
        dataUser.username = request.body.username
    }
    if (request.body.email !== undefined) {
        dataUser.email = request.body.email
    }
    if (request.body.full_name !== undefined) {
        dataUser.full_name = request.body.full_name
    }
    if (request.body.role !== undefined) {
        if (!['user', 'admin'].includes(request.body.role)) {
            return response.status(400).json({
                success: false,
                message: 'Role hanya boleh user atau admin'
            })
        }
        dataUser.role = request.body.role
    }

    if (Object.keys(dataUser).length === 0) {
        return response.status(400).json({
            success: false,
            message: 'Tidak ada data yang dikirim untuk diperbarui'
        })
    }

    try {
        const user = await User.findByPk(request.params.id)
        if (!user) {
            return response.json({
                success: false,
                message: 'user not found'
            })
        }

        await user.update(dataUser)
        return response.json({
            success: true,
            message: 'Data has updated'
        })
    } catch (error) {
        return response.json({
            success: false,
            message: error.message
        })
    }
}

exports.ResetPassword = async(request, response) => {
    let email = request.body.email
    let newPassword = request.body.password

    if(!email || !newPassword) {
        return response.status(400).json ({
            success: false,
            message: "Email and new password are required"
        })
    } 
    User.update({password: md5(newPassword)},{where:{email: email}})
    .then(result => {
        if(result[0] === 0) {
            return response.json({
                success: false,
                message: "User not found"
            })
        }
        return response.json({
            success: true,
            message: "Password has been reset"
        })
    })
    .catch(error => {
        return response.json({
            success: false,
            messagee: error.message
        })
    })
}

exports.deleteUser = async(request, response) => {
    let user_id = request.params.id
    User.destroy({where:{id:user_id}})
    .then(result => {
        if (result === 0) {
            return response.json({
                success: false,
                message: 'user not found'
            })
        }
        return response.json({
            success: true,
            message: 'user has deleted'
        })
    })
    .catch(error => {
        return response.json({
            success: false,
            message: error.message
        })
    })
}