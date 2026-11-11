/** load library express */
const express = require(`express`)
const app = express()

const cors = require(`cors`)

app.use(cors())
app.use(express.json())

const userRoute = require('./routes/user.route')
const debtRoute = require('./routes/debt.route')
const debtorRoute = require('./routes/debtor.route')
const transactionRoute = require('./routes/transaction.route')
const authRoute = require('./routes/auth.route')
const auth = require('./middleware/auth')

app.use('/users', userRoute)
app.use('/debts', auth.authorize, debtRoute)
app.use('/debtors', auth.authorize, debtorRoute)
app.use('/transaction', auth.authorize, transactionRoute)
app.use('/auth', authRoute)

app.use((request, response) => {
    return response.status(404).json({
        success: false,
        message: 'route not found'
    })
})

const PORT = 8000

app.listen(PORT, () => {
    console.log(`Servers runs on port ${PORT}`)
})