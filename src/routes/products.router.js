import { Router } from 'express'
import { productModel } from '../../models/Products.js'

const productsRouter = Router()

productsRouter.get('/:pid', async (req, res) => {
try {
    const pid = req.params.pid
    const product = await productModel.findById(pid)
    if(!product){
        console.log('no existe un producto con ese ID')
    }
    res.status(200).json({
        message: product
    })
} catch (error) {
    res.status(400).json({
        message: `No se pudo obtener el producto`
    })
}
})

productsRouter.get('/', async (req, res) => {
    try {
        const url = "http://localhost:8080/api"
        const { limit = 10, page = 1, sort, query } = req.query

        if (limit > 10) {
            throw new Error("El límite de consulta es por 10 productos")
        }

        const parsedLimit = parseInt(limit)
        const parsedPage = parseInt(page)
        const sortOption = sort === 'desc' ? { price: -1 } : { price: 1 }

        const parsedQuery = query ? JSON.parse(query) : {}
        const queryKeys = Object.keys(parsedQuery)
        if (queryKeys.length && !queryKeys.includes('category') && !queryKeys.includes('stock')) {
            throw new Error("Es obligatorio buscar por categoría o disponibilidad")
        }

        const result = await productModel.paginate(parsedQuery, { 
            limit: parsedLimit, 
            page: parsedPage, 
            sort: sortOption 
        })

        const link = (incomingPage) => 
            `${url}/products?limit=${parsedLimit}&page=${incomingPage}&sort=${sort === 'desc' ? 'desc' : 'asc'}&query=${(JSON.stringify(parsedQuery))}`

        res.status(200).json({
            ...result,
            status: "success",
            prevLink: result.hasPrevPage ? link(result.prevPage) : null,
            nextLink: result.hasNextPage ? link(result.nextPage) : null
        })

    } catch (err) {
        res.status(400).json({ status: "error", payload: { message: err.message } })
    }
})

productsRouter.post('/', async (req, res) => {
    try {
        const product = req.body
        if(!product){
            res.status(400).json({
                message: 'Completa el body de la request para postear un producto'
            })
        }

        const createdProduct = await productModel.create(product)
        res.status(200).json({
            message: 'Producto creado con éxito',
            product: createdProduct
        })
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
})

// productsRouter.get('/realTimeProducts', (req, res) => {
//     res.render('realTimeProducts')
// })

// productsRouter.delete('/realTimeProducts/:pid', (req, res) => {
//     const pid = parseInt(req.params.pid)

//     const index = products.findIndex(p => p.id === pid)
//     if (index === -1) {
//         return res.status(404).json({ message: 'Producto no encontrado' })
//     }

//     products.splice(index, 1)

//     res.status(200).json({
//         message: 'Producto eliminado con éxito',
//         products: products
//     })
// })

// productsRouter.get('/realtimeproducts', (req, res) => {
//     res.render('realTimeProducts', {products})
// })

export default productsRouter