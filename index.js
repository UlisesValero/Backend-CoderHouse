import express from 'express'
import handlebars from 'express-handlebars'
import productsRouter from './src/routes/products.router.js'
import cartsRouter from './src/routes/carts.router.js'
import mongoose from 'mongoose'


process.loadEnvFile()
const app = express()
const PORT = 8080

mongoose.connect(process.env.MONGO_STRING).then((db) => {
    console.log('Conectado a MongoDB @:', db.connection.host)
}).catch((err) => {
    console.log('Error al conectar a MongoDB:', err)
})


app.use(express.json())

app.engine('handlebars', handlebars.engine())
app.set('view engine', 'handlebars')
app.set('views', './views')
app.use(express.static('./public'))

app.use('/api/carts', cartsRouter)
app.use('/api/products', productsRouter)


app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`)
})


