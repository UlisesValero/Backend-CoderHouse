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
        let product = products.filter(p => p.id === id)

        if (product) {
            return product            
        }
        else {
            console.log(`producto con id ${id} no encontrado`)
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

        searchOrderById(id) {
            let stringData = fs.readFileSync(this.path, 'utf8')
            let parsedData = JSON.parse(stringData)

            let idFiltrado = parsedData.order.find(o => o.id === id) 
            console.log(idFiltrado)
            return idFiltrado
        }

        deleteOrder() {

        }

    }


    let ejemplo = new CartManager('./carts.json')
    ejemplo.addOrder()


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
    const cartOrder =  new CartManager('./carts.json')
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

app.post('/carts/:cid/product/:pid', (req, res) => {
const cartOrder = new CartManager('./carts.json')
const newProduct = new ProductManager('./products.json')
const filteredOrder = cartOrder.searchOrderById(req.params.cid)
const filteredProduct = newProduct.getProductsById(req.params.pid)
const stringData = fs.readFileSync('./carts.json' , 'utf8')
console.log(stringData)
const parsedData = JSON.parse(stringData)



})