const express = require('express')
const fs = require('fs')
const app = express()
app.use(express.json())
const PORT = 8080
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`)
})

class ProductManager {

    constructor(route) {
        this.path = route
    }


    addProduct(product) {
        const stringData = fs.readFileSync(this.path, 'utf8')
        const parsedData = JSON.parse(stringData)
        const products = parsedData.products

        let existingTitle = products.find(p => p.title === product.title)
        if (existingTitle) throw new Error(`El producto con titulo ${product.title} ya existe`)

        let existingCode = products.find(p => p.code === product.code)
        if (existingCode) throw new Error(`El producto con el código ${product.code} ya existe`)

        let newProduct = {
            id: products.length + 1,
            ...product
        }
        products.push(newProduct)

        let json = {
            products: products,
        }

        fs.writeFileSync(this.path, JSON.stringify(json))
        return json
    }

    getProducts() {
        const stringData = fs.readFileSync(this.path, 'utf8')
        const parsedData = JSON.parse(stringData)
        return parsedData
    }

    getProductsById(id) {
        const stringData = fs.readFileSync(this.path, 'utf8')
        const parsedData = JSON.parse(stringData)

        if (!parsedData.products) parsedData.products = []
        let products = parsedData.products

        let product = products.find(p => p.id === id)

        if (product) {
            return product
        } else {
            return null
        }
    }

    putProduct(pid, newData) {
        const stringData = fs.readFileSync(this.path, 'utf8')
        const parsedData = JSON.parse(stringData)
        const products = parsedData.products

        const index = products.find(p => p.id === pid)
        if (!index) throw new Error(`Producto con id ${pid} no existe`)

        products[index] = {
            ...products[index],
            ...newData,
            id: pid
        }

        const updatedData = { products }

        fs.writeFileSync(this.path, JSON.stringify(updatedData, null, 2))
        return products[index]
    }

    deleteProduct(pid) {
        const stringData = fs.readFileSync(this.path, 'utf8')
        const parsedData = JSON.parse(stringData)
        const products = parsedData.products

        const filteredProduct = products.filter(p => p.id !== pid)

        if (products.length == filteredProduct.length)
            throw new Error(`El producto con el id ${pid} no existe`)

        let json = {
            products: filteredProduct
        }

        fs.writeFileSync(this.path, JSON.stringify(json))
        return json
    }
}




app.get('/products', (req, res) => {
    try {
        const newManager = new ProductManager('./products.json')
        const newProduct = newManager.getProducts()
        res.status(200).json({
            message: "Productos obtenidos con éxito",
            product: newProduct
        })
    } catch (error) {
        throw new Error("No se pudieron obtener los productos")
    }
})

app.get('/products/:pid', (req, res) => {
    try {
        const newManager = new ProductManager('./products.json')
        const filteredProduct = newManager.getProductsById(parseInt(req.params.pid))
        res.status(200).json({
            message: "Producto filtrado obtenido",
            products: filteredProduct
        })
    } catch (error) {
        throw new Error(`No se pudo obtener el producto con ${pid}`)
    }
})

app.post('/products', (req, res) => {
    try {
        const newManager = new ProductManager('./products.json')
        let postProduct = req.body
        res.status(200).json(
            newManager.addProduct(postProduct),
            { message: "Producto agregado con éxito", }
        )
    } catch (error) {
        res.status(505).json({
            message: error.message
        })
    }
})

app.delete('/products/:pid', (req, res) => {
    try {
        const newManager = new ProductManager('./products.json')
        const pid = parseInt(req.params.pid)
        const deleteProduct = newManager.deleteProduct(pid)
        res.status(200).json({
            message: "Producto eliminado con éxito",
            products: deleteProduct
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
})

app.put('/products/:pid', (req, res) => {
    try {
        const newManager = new ProductManager('./products.json')
        const pid = parseInt(req.params.pid)
        const putProduct = req.body
        const updatedProduct = newManager.putProduct(pid, putProduct)
        res.status(200).json({
            message: "Producto modificado con éxito",
            products: updatedProduct
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
})


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

        const cart = parsedData.order.find(o => o.id === parseInt(cid))
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


app.get('/carts/:cid', (req, res) => {
    try {
        const cartOrder = new CartManager('./carts.json')
        const filterOrder = cartOrder.searchOrderById(parseInt(req.params.cid))
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
    try {
        const cartOrder = new CartManager('./carts.json')
        const postOrder = cartOrder.addOrder()
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
    try {
        const cartManager = new CartManager('./carts.json')
        const productManager = new ProductManager('./products.json')
        const cid = parseInt(req.params.cid)
        const pid = parseInt(req.params.pid)
        const cart = cartManager.searchOrderById(cid)
        const product = productManager.getProductsById(pid)
        cartManager.addProductToCart(cid, pid)
        res.status(200).json({
            message: `Al fin agregaste el producto: ${pid} al carrito id: ${cid}`,
            carrito: cart
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
})
