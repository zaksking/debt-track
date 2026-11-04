const {Debtor, User} = require('../models')

// merapikan nama: '  budi   SANTOSO ' -> 'Budi Santoso'
function rapikanNama(name) {
    return name
        .trim()
        .replace(/\s+/g, ' ')
        .toLowerCase()
        .replace(/(^| )\S/g, (huruf) => huruf.toUpperCase())
}

exports.getAllDebtors = (request,response) => {
    let filter = {}
    if (request.query.user_id) {
        filter.user_id = request.query.user_id
    }
    Debtor.findAll({where: filter})
    .then(result => {
        return response.json({
            success: true,
            data: result,
            message: 'All debtor has loaded'
        })
    })
    .catch(error => {
        return response.json({
            success: false,
            message: error.message
        })
    })
}

exports.getDebtorById = (request,response) => {
    let debtor_id = request.params.id
    Debtor.findOne({where: {id: debtor_id}})
    .then(result => {
        if (result) {
            return response.json({
                success: true,
                data: result,
                message: 'debtor found'
            })
        } else {
            return response.json({
                success: false,
                message: 'debtor not found'
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

exports.getDebtorByuserID = (request, response) => {
    let user_id = request.params.id 
    Debtor.findOne({where:{user_id}})
    .then(result => {
        if(result) {
            return response.json({
                success: true,
                data: result,
                message: "Data not found"
            })
        }else {
            return response.json({
                success: false,
                message: "Data not found"
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


exports.newDebtor = async(request,response) => {
    if (!request.body.name) {
        return response.json({
            success: false,
            message: 'name wajib diisi'
        })
    }

    if (!request.body.user_id) {
        return response.json({
            success: false,
            message: 'user_id wajib diisi'
        })
    }

    try {
        let user = await User.findByPk(request.body.user_id)
        if (!user) {
            return response.json({
                success: false,
                message: 'user not found'
            })
        }
    } catch (error) {
        return response.json({
            success: false,
            message: error.message
        })
    }

    let newDebtor = {
        user_id: request.body.user_id,
        name: rapikanNama(request.body.name),
        phone: request.body.phone,
        email: request.body.email,
        address: request.body.address,
        notes: request.body.notes
    }
    Debtor.create(newDebtor)
    .then(result => {
        return response.json({
            success: true,
            data: result,
            message: 'new Debtor has been inserted'
        })
    })
    .catch(error => {
        return response.json({
            success: false,
            message: error.message
        })
    })
}

exports.updateDebtor = (request,response) => {
    let dataDebtor = {
        user_id: request.body.user_id,
        name: request.body.name ? rapikanNama(request.body.name) : undefined,
        phone: request.body.phone,
        email: request.body.email,
        address: request.body.address,
        notes: request.body.notes
    }
    let debtor_id = request.params.id
    Debtor.update(dataDebtor, {where: {id: debtor_id}})
    .then(result => {
        if (result[0] === 0) {
            return response.json({
                success: false,
                message: 'debtor not found'
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

exports.deleteDebtor = (request,response) => {
    let debtor_id = request.params.id
    Debtor.destroy({where: {id: debtor_id}})
    .then(result => {
        if (result === 0) {
            return response.json({
                success: false,
                message: 'debtor not found'
            })
        }
        return response.json({
            success: true,
            message: 'debtor has deleted'
        })
    })
    .catch(error => {
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return response.json({
                success: false,
                message: 'debtor masih punya utang, hapus utangnya dulu'
            })
        }
        return response.json({
            success: false,
            message: error.message
        })
    })
}
