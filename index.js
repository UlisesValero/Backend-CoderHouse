import express from 'express'
import handlebars from 'express-handlebars'
import productsRouter from './src/routes/products.router.js'
import cartsRouter from './src/routes/carts.router.js'
import mongoose from 'mongoose'
import { Server } from 'socket.io'
import http from 'http'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = 8080

app.use(express.json())
app.use(express.static('./public'))

app.engine('handlebars', handlebars.engine())
app.set('view engine', 'handlebars')
app.set('views', './views')

app.use('/api/carts', cartsRouter)
app.use('/api/products', productsRouter)

mongoose.connect(process.env.MONGO_STRING)
    .then(db => console.log('Conectado a MongoDB @:', db.connection.host))
    .catch(err => console.log('Error al conectar a MongoDB:', err))

const server = http.createServer(app)
const sockets = new Server(server)

let cid = 0

sockets.on('connection', (socket) => {
    console.log('Usuario conectado a la tienda de productos');

    socket.on('getCart', () => {
        socket.emit('cart', cid);
    });

    socket.on('postCart', (incomingId) => {
        cid = incomingId;
        io.emit('cart', cid);
    });
});

server.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${PORT}`);
})
