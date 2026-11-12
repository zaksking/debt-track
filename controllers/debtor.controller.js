const {Debtor} = require('../models')

// merapikan nama: '  budi   SANTOSO ' -> 'Budi Santoso'
function rapikanNama(name) {
    return name
        .trim()
        .replace(/\s+/g, ' ')
        .toLowerCase()
        .replace(/(^| )\S/g, (huruf) => huruf.toUpperCase())
}

function getOwnerFilter(request) {
    return request.user.role === 'admin' ? {} : { user_id: request.user.user_id }
}

exports.getAllDebtors = async (request, response) => {
    try {
        const result = await Debtor.findAll({ where: getOwnerFilter(request) })

        return response.json({
            success: true,
            data: result,
            message: result.length > 0 ? 'All data has loaded' : 'You have no data'
        })
    } catch (error) {
        return response.json({
            success: false,
            message: error.message
        })
    }
}

exports.getDebtorById = async (request, response) => {
    try {
        const result = await Debtor.findOne({
            where: { id: request.params.id, ...getOwnerFilter(request) }
        })

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
    } catch (error) {
        return response.json({
            success: false,
            message: error.message
        })
    }
}

exports.getDebtorByUserId = async (request, response) => {
    try {
        const userId = request.user.role === 'admin'
            ? request.params.id
            : request.user.user_id
        const result = await Debtor.findAll({ where: { user_id: userId } })

        return response.json({
            success: true,
            data: result,
            message: result.length > 0 ? 'Debtor found' : 'Debtor not found'
        })
    } catch (error) {
        return response.json({
            success: false,
            message: error.message
        })
    }
}


exports.newDebtor = async(request,response) => {
    if (!request.body.name) {
        return response.json({
            success: false,
            message: 'name wajib diisi'
        })
    }

    let newDebtor = {
        user_id: request.user.user_id,
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
        name: request.body.name ? rapikanNama(request.body.name) : undefined,
        phone: request.body.phone,
        email: request.body.email,
        address: request.body.address,
        notes: request.body.notes
    }
    let debtor_id = request.params.id
    Debtor.update(dataDebtor, {
        where: { id: debtor_id, ...getOwnerFilter(request) }
    })
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
    Debtor.destroy({
        where: { id: debtor_id, ...getOwnerFilter(request) }
    })
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
