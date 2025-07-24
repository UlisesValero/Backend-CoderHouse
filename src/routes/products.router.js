import { Router } from 'express'
// import { readFileSync } from 'node:fs'


const router = Router()
const products = [{name:"Ulises", price:105, descripcion:"descripcion"}]

router.get('/', (req, res) => {
    res.render('home', {products})
})


router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', {products})
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

    req.socket.emit('newProduct', products)
    // Vincular el endpoint con el socket

    res.status(201).json({
        message: "Producto creado con éxito",
        product: products
    })
})

router.delete('/realTimeProducts/:pid', (req, res) => {
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


export default router