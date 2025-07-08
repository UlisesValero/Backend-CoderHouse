const express = require('express')
const fs = require('fs');

class ProductManager {

    constructor(route) {
        this.path = route
    }

    addProduct(title, description, price, thumbnail, code, stock) {
        let stringData = fs.readFileSync(this.path, 'utf8')
        let parsedData = JSON.parse(stringData)

        if (!parsedData.products) parsedData.products = []
        const products = parsedData.products

        const newProduct = {
            id: products.length + 1,
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        }
        products.push(newProduct)

        fs.writeFileSync(this.path, JSON.stringify(parsedData))
    }

    getProducts() {
        const stringData = fs.readFileSync(this.path, 'utf8')
        console.log(stringData)

        const parsedData = JSON.parse(stringData)
        return parsedData
    }

    getProductsById(id) {
        const stringData = fs.readFileSync(this.path, 'utf8')
        const parsedData = JSON.parse(stringData)

        let products = parsedData.products
        let product = products.find(p => p.id === id)

        if (product) {
            return product
        } else {
            console.log(`Producto con id ${id} no encontrado`)
            return null
        }
    }

}

class CartManager {

    constructor(route) {
        this.path = route
    }

    addOrder() {
        let stringData = fs.readFileSync(this.path, 'utf8')
        let parsedData = JSON.parse(stringData)

        if (!parsedData.order) parsedData.order = []
        const order = parsedData.order

        let newOrder = {
            id: order.length + 1,
            products: []
        }
        order.push(newOrder)


        fs.writeFileSync(this.path, JSON.stringify(parsedData))
    }

    addProductToCart(cid, pid) {
        const stringData = fs.readFileSync(this.path, 'utf8')
        const parsedData = JSON.parse(stringData)

        const cart = parsedData.order.find(o => o.id === Number(cid))
        const productInCart = cart.products.find(p => p.id === pid)

        if (productInCart) {
            productInCart.quantity += 1
        } else {
            cart.products.push({ id: pid, quantity: 1 })
        }


        fs.writeFileSync(this.path, JSON.stringify(parsedData))

    }

    searchOrderById(id) {
        let stringData = fs.readFileSync(this.path, 'utf8')
        let parsedData = JSON.parse(stringData)

        let idFiltrado = parsedData.order.find(o => o.id === Number(id))
        console.log(idFiltrado)
        return idFiltrado
    }
}







const app = express()
app.use(express.json())

const PORT = 8080

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`)
})


app.get('/carts/:cid', (req, res) => {
    const cartOrder = new CartManager('./carts.json')
    const filterOrder = cartOrder.searchOrderById(parseInt(req.params.cid))
    try {
        res.status(200).json({
            message: "Orden obtenida con éxito",
            order: filterOrder
        })
    } catch (error) {
        res.status(500).json({
            message: "Error obteniendo la orden",
            error: error.message
        })
    }
})


app.post('/carts', (req, res) => {
    const cartOrder = new CartManager('./carts.json')
    const postOrder = cartOrder.addOrder()
    try {
        res.status(201).json({
            message: "Orden agregada",
            order: postOrder
        })
    } catch (error) {
        res.status(500).json({
            message: error.message,
            error: "Error agregando la orden"
        })
    }
})

app.post('/carts/:cid/products/:pid', (req, res) => {
    const cartManager = new CartManager('./carts.json')
    const productManager = new ProductManager('./products.json')

    const cid = parseInt(req.params.cid)
    const pid = parseInt(req.params.pid)

    const cart = cartManager.searchOrderById(cid)
    const product = productManager.getProductsById(pid)
    console.log("El carrito:", cart)
    console.log("El producto:", product)

    const addProduct = cartManager.addProductToCart(cid, pid)

    if (!addProduct) {
        return res.status(500).json({ 
            message: "No se agregó el producto al carrito" 
        })
    }

    res.status(200).json({
        message: `Al fin agregaste el producto: ${pid} al carrito id: ${cid}`,
        carrito: cart
    })


})




// let ejemplo = new ProductManager('./products.json')

// const llamada = ejemplo.getProductsById(2)
// console.log(llamada)