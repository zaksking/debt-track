const {User} = require('../models')
const md5 = require('md5')

exports.newUser = (request,response) => {
    let newUser = {
        username: request.body.username,
        email: request.body.email,
        password_hash: md5(request.body.password),
        full_name: request.body.full_name
    }
    User.create(newUser)
    .then(result => {
        return response.json({
            success: true,
            data: result,
            message: 'New user has been inserted'
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
    let dataUser = {
        username: request.body.username,
        email: request.body.email,
        full_name: request.body.full_name
    }
    let user_id = request.params.id
    User.update(dataUser, {where:{id:user_id}})
    .then(result => {
        if (result[0] === 0) {
            return response.json({
                success: false,
                message: 'user not found'
            })
        }
        return response.json({
            success: true,
            message: 'Data has updated'
        })
    })
    .catch(error => {
        return response.json({
            success: false,
            message: error.message
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