import express from 'express'
import handlebars from 'express-handlebars'
import http from 'http'
import { Server } from 'socket.io'
import productsRouter from './src/routes/products.router.js'


const app = express()
const PORT = 8080
app.use(express.json())

const server = http.createServer(app)

app.engine('handlebars', handlebars.engine())
app.set('view engine', 'handlebars')
app.set('views', './views')
app.use(express.static('./public'))

app.use('/', productsRouter)

server.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`)
})


const sockets = new Server(server)

let products = []


sockets.on('connection', (socket) => {
    console.log(`Nuevo usuario conectado`)

    socket.on('getProducts', (...products) => {
        sockets.emit('getProducts', ...products)
    })

    socket.on('addProduct', (product) => {
        product.id = products.length + 1

        products.push(product)
        sockets.emit('productsList', products)

    })

    socket.on('deleteProduct', ( {name} ) => {
    
        products = products.filter(p => p.name !== name)
        sockets.emit('productsList', products)
        
    })

    socket.on('disconnected', () => {
        console.log(`Usuario desconectado`)
    })
})