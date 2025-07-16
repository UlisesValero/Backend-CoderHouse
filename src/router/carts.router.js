const { Router } = require('express')
const fs = require('fs')
const CartManager = require('../../managers/CartsManager')
const ProductManager = require('../../managers/ProductManager')


const cartsRouter = Router()


cartsRouter.get('/carts/:cid', (req, res) => {
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

cartsRouter.post('/carts', (req, res) => {
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

cartsRouter.post('/carts/:cid/products/:pid', (req, res) => {
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


module.exports = cartsRouter