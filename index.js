/** load library express */
const express = require(`express`)
const app = express()

const cors = require(`cors`)

app.use(cors())
app.use(express.json())

const userRoute = require('./routes/user.route')
const debtRoute = require('./routes/debt.route')
const debtorRoute = require('./routes/debtor.route')

app.use('/users', userRoute)
app.use('/debts', debtRoute)
app.use('/debtors', debtorRoute)

const PORT = 8000

app.listen(PORT, () => {
    console.log(`Servers runs on port ${PORT}`)
})