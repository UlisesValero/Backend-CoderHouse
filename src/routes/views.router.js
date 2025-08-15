import { Router } from 'express'

const viewsRouter = Router()
const URL = 'http://localhost:8080/api'

viewsRouter.get('/', async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : 10
        const page = req.query.page ? parseInt(req.query.page) : 1
        const sort = req.query.sort == 'desc' ? { price: -1 } : { price: 1 }

        const query = req.query.query ? JSON.parse(req.query.query) : {}
        const urlQuery = '?limit=' + limit + '&sort=' + (sort.price ? 'asc' : 'desc') + '&query=' + JSON.stringify(query) + '&page=' + page
        const request = await fetch(`${URL}/products${urlQuery}`)
        console.log(request)
        const result = await request.json()
        console.log(result)
        res.render('index', { products: result.docs, nextLink: result.nextLink, prevLink: result.prevLink })
    } catch (error) {
        res.status(400).json({ err: error.message })
    }
})

viewsRouter.get('/products', async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : 10
        const page = req.query.page ? parseInt(req.query.page) : 1
        const sort = req.query.sort == 'desc' ? { price: -1 } : { price: 1 }

        const query = req.query.query ? JSON.parse(req.query.query) : {}
        const urlQuery = '?limit=' + limit + '&sort=' + (sort.price ? 'asc' : 'desc') + '&query=' + JSON.stringify(query) + '&page=' + page
        const request = await fetch(`${URL}/products${urlQuery}`)
        console.log(request)
        const result = await request.json()
        console.log(result)
        res.render('index', { products: result.docs, nextLink: result.nextLink, prevLink: result.prevLink })
    } catch (error) {
        res.status(400).json({ err: error.message })
    }
})

viewsRouter.get('/products/:pid', async (req, res) => {
    try {
        const pid = req.params.pid
        const response = await fetch(`${URL}/products/${pid}`)
        const product = await response.json()
        res.render('productDetail', { product: product.product })
    } catch (error) {
        res.status(400).json({ err: error.message })
    }
})

viewsRouter.get('/carts/:cid', async (req, res) => {
    try {
        const cid = req.params.cid
        const response = await fetch(`${URL}/carts/${cid}`)
        const cart = await response.json()

        res.render('cartDetail', { cart: cart })
    } catch (error) {
        res.status(400).json({ err: error.message })
    }
})

export default viewsRouter
