const express = require('express')
const app = express()
const port = 5000
const logger = require('morgan')
const mongoose = require('mongoose')

const productRouter = require('./src/router/products')
const userRouter = require('./src/router/users')

const config = require('./config')

mongoose.connect(config.MONGODB_URL)
.then(() => console.log('mongodb Connect success !! '))
.catch( e => console.log(`mongodb Connect Falil : ${e}`))

app.use(express.json())
app.use(logger('tiny'))

app.use('/api/users', userRouter)
app.use('/api/products', productRouter)



app.get('/error', (req, res, next) => {
    throw new Error('서버에 치명적인 에러가 발생했습니다.')
})

app.use((req, res, next) => {
    res.status(404).send('Page not Found')
})

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Internal Server Error')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})