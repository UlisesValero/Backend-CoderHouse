const express = require('express')
const cartsRouter = require('./src/router/carts.router')
const productRouter = require('./src/router/product.router')

const app = express()
app.use(express.json())
app.use('/api/carts', cartsRouter)
app.use('/api/products', productRouter)

const PORT = 8080
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`)
})








