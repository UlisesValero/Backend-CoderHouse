import { Router } from 'express'

const router = Router()
const products = [{name: "Ulises", price: 105, description:"Esta es la desc"}]

router.get('/', (req, res) => {
    res.render('home', {products})
})

router.post('/', (req, res) => {
    const {name, price, description} = req.body

    const newProduct = {
        id: products.length + 1,
        name,
        price,
        description
    }
    products.push(newProduct)

    // req.io.emit('newProduct', products)
    // Vincular el endpoint con el socket

    res.status(201).json({
        message: "Producto creado con éxito",
        product: products
    })
})

export default router