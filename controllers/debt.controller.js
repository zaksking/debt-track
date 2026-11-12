const {Debt, Debtor}  = require('../models')
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

exports.addNewDebt = async(request,response) => {
    let debtorId = request.body.debtor_id

    if (!debtorId && request.body.peminjam) {
        try {
            let [debtor] = await Debtor.findOrCreate({
                where: {
                    name: rapikanNama(request.body.peminjam),
                    user_id: request.user.user_id
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
        let debtor = await Debtor.findOne({
            where: {
                id: debtorId,
                user_id: request.user.user_id
            }
        })
        if (!debtor) {
            return response.status(404).json({
                success: false,
                message: 'Debtor tidak ditemukan atau bukan milik user yang login'
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
    user_id: request.user.user_id,
    title: request.body.judul,
    initial_amount: request.body.jumlah,
    remaining_amount: request.body.jumlah,
    description: request.body.deskripsi,
    due_date: request.body.tenggat,
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

exports.getAllDebts = async (request, response) => {
    try {
        const result = await Debt.findAll({
            where: getOwnerFilter(request)
        })

        return response.json({
            success: true,
            data: result,
            message: result.length > 0 ? 'All debts has loaded' : 'You have no data'
        })
    } catch (error) {
        return response.json({
            success: false,
            message: error.message
        })
    }
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
    Debt.update(debtData, {
        where: { id: debt_id, ...getOwnerFilter(request) }
    })
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
    Debt.destroy({
        where: { id: debt_id, ...getOwnerFilter(request) }
    })
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
exports.getDebtById = async (request, response) => {
    try {
        const result = await Debt.findOne({
            where: { id: request.params.id, ...getOwnerFilter(request) }
        })

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
    } catch (error) {
        return response.json({
            success: false,
            message: error.message
        })
    }
}