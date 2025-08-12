import { Router } from 'express'
import { productModel } from '../../models/Products.js'
import { cartModel } from '../../models/Carts.js'
import mongoose from 'mongoose'

const productsRouter = Router()

productsRouter.get('/:pid', async (req, res) => {
try {
    const pid = req.params
    const product = await productModel.findById(pid)
    if(!product){
        console.log('no existe un producto con ese ID')
    }
    res.status(200).json({
        message: product
    })
} catch (error) {
    res.status(400).json({
        // message: `No se pudo obtener el producto con ${pid}`
    })
}

    // res.render('home', {products})
})

productsRouter.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', {products})
})

productsRouter.post('/', (req, res) => {
    const product = req.body

    // const {name, price, description} = req.body

    // const newProduct = {
    //     id: products.length + 1,
    //     name,
    //     price,
    //     description
    // }
    // products.push(newProduct)

    // req.socket.emit('newProduct', products)

    // res.status(201).json({
    //     message: "Producto creado con éxito",
    //     product: products
    // })
})

productsRouter.get('/realTimeProducts', (req, res) => {
    res.render('realTimeProducts')
})

productsRouter.delete('/realTimeProducts/:pid', (req, res) => {
    const pid = parseInt(req.params.pid)

    const index = products.findIndex(p => p.id === pid)
    if (index === -1) {
        return res.status(404).json({ message: 'Producto no encontrado' })
    }

    products.splice(index, 1)

    res.status(200).json({
        message: 'Producto eliminado con éxito',
        products: products
    })
})


export default productsRouter