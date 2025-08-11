import { Router } from 'express'

const viewsRouter = Router()
const URL = 'http://localhost:8080/api'

viewsRouter.get('/', (req, res) => {

})

viewsRouter.get('/products/:pid', (req, res) => {
    try {
        const pid = req.params.pid
        const product = fetch(`/api/products/${pid}`)
        res.status(200).json({product})
    } catch (error) {
        res.status(400).json({err: error.message})
    }
})

viewsRouter.get('/carts/:cid', async (req, res) => {    
    try {
        const cid = req.params.cid
        const cart = fetch(`/api/carts/${cid}`)
        res.status(200).json({cart})
    } catch (error) {
        res.status(400).json({err: error.message})        
    }
})

export default viewsRouter