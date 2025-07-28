import { Router } from 'express'

const router = Router()
const products = [{name: "Ulises", price: 105}]
//Para que aparezcan productos en la vista "/", hay que cargarlos manualmente en el array products


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

    res.status(201).json({
        message: "Producto creado con éxito",
        product: products
    })
})

router.get('/realTimeProducts', (req, res) => {
    res.render('realTimeProducts')
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