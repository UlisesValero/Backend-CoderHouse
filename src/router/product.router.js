const { Router } = require('express')
const fs = require('fs')
const ProductManager = require('../../managers/ProductManager')


const productRouter = Router()


productRouter.get('/', (req, res) => {
    try {
        console.log('ESTE es el get de products.')
        const newManager = new ProductManager('./src/products.json')
        const newProduct = newManager.getProducts()
        res.status(200).json({
            message: "Productos obtenidos con éxito",
            product: newProduct
        })
    } catch (error) {
        throw new Error(error.message)
    }
})

productRouter.get('/:pid', (req, res) => {
    try {
        const newManager = new ProductManager('./src/products.json')
        const filteredProduct = newManager.getProductsById(parseInt(req.params.pid))
        res.status(200).json({
            message: "Producto filtrado obtenido",
            products: filteredProduct
        })
    } catch (error) {
        throw new Error(`No se pudo obtener el producto con ${pid}`)
    }
})

productRouter.post('/', (req, res) => {
    try {
        const newManager = new ProductManager('./src/products.json')
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

productRouter.delete('/:pid', (req, res) => {
    try {
        const newManager = new ProductManager('./src/products.json')
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

productRouter.put('/:pid', (req, res) => {
    try {
        const newManager = new ProductManager('./src/products.json')
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

module.exports = productRouter