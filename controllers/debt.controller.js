const {Debt, Debtor, User}  = require('../models')
// merapikan nama: '  budi   SANTOSO ' -> 'Budi Santoso'
function rapikanNama(name) {
    return name
        .trim()
        .replace(/\s+/g, ' ')
        .toLowerCase()
        .replace(/(^| )\S/g, (huruf) => huruf.toUpperCase())
}

exports.addNewDebt = async(request,response) => {
    let debtorId = request.body.debtor_id

    if (!debtorId && request.body.debtor_name) {
        try {
            let [debtor] = await Debtor.findOrCreate({
                where: {
                    name: rapikanNama(request.body.debtor_name),
                    user_id: request.body.user_id
                },
                defaults: {
                    phone: request.body.debtor_phone,
                    email: request.body.debtor_email,
                    address: request.body.debtor_address,
                    notes: request.body.debtor_notes
                }
            })

            // kalau debtor sudah ada tapi datanya masih kosong, isi dari body
            let isiKosong = {}
            if (!debtor.phone && request.body.debtor_phone) {
                isiKosong.phone = request.body.debtor_phone
            }
            if (!debtor.email && request.body.debtor_email) {
                isiKosong.email = request.body.debtor_email
            }
            if (!debtor.address && request.body.debtor_address) {
                isiKosong.address = request.body.debtor_address
            }
            if (!debtor.notes && request.body.debtor_notes) {
                isiKosong.notes = request.body.debtor_notes
            }
            if (Object.keys(isiKosong).length > 0) {
                await debtor.update(isiKosong)
            }

            debtorId = debtor.id
        } catch (error) {
            return response.json({
                success: false,
                message: error.message
            })
        }
    }

    if (!debtorId) {
        return response.json({
            success: false,
            message: 'debtor_id atau debtor_name wajib diisi'
        })
    }

    try {
        let debtor = await Debtor.findByPk(debtorId)
        if (!debtor) {
            return response.json({
                success: false,
                message: 'debtor not found'
            })
        }

        let user = await User.findByPk(request.body.user_id)
        if (!user) {
            return response.json({
                success: false,
                message: 'user not found'
            })
        }

        if (Number(request.body.user_id) !== debtor.user_id) {
            return response.json({
                success: false,
                message: 'debtor ini bukan milik user_id tersebut'
            })
        }
    } catch (error) {
        return response.json({
            success: false,
            message: error.message
        })
    }

    let newDebt = {
    debtor_id: debtorId,
    user_id: request.body.user_id,
    title: request.body.title,
    initial_amount: request.body.initial_amount,
    remaining_amount: request.body.initial_amount,
    description: request.body.description,
    due_date: request.body.due_date,
    status: request.body.status
}
    Debt.create(newDebt)
    .then(result => {
        return response.json({
            success: true,
            data: result,
            message: 'new Debt has been inserted'
        })
    })
    .catch(error => {
        return response.json({
            success: false, 
            message: error.message
        })
    })
}

exports.getAllDebts = async (request,response) => {
    Debt.findAll()
    .then(result => {
        return response.json({
            success: true,
            data: result,
            message: 'All debts has loaded'
        })
    })
    .catch(error => {
        return response.json({
            success: false,
            message: error.message
        })
    })
}

exports.updateDebts = async (request,response) => {
    let debtData = {
    title: request.body.title,
    initial_amount: request.body.initial_amount,
    description: request.body.description,
    due_date: request.body.due_date,
    status: request.body.status
    }
    let debt_id = request.params.id
    Debt.update(debtData, {where: {id: debt_id}})
    .then(result => {
        if (result[0] === 0) {
            return response.json({
                success: false,
                message: 'debt not found'
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

exports.deleteDebt = async(request, response) => {
    let debt_id = request.params.id
    Debt.destroy({where: {id: debt_id}})
    .then(result => {
        if (result === 0) {
            return response.json({
                success: false,
                message: 'debt not found'
            })
        }
        return response.json({
            success: true,
            message: 'debt has deleted'
        })
    })
    .catch(error => {
        return response.json({
            success: false,
            message: error.message
        })
    })
}
exports.getDebtById = (request,response) => {
    let debt_id = request.params.id
    Debt.findOne({where: {id: debt_id}})
    .then(result => {
        if (result) {
            return response.json({
                success: true,
                data: result,
                message: 'debt found'
            })
        } else {
            return response.json({
                success: false,
                message: 'debt not found'
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