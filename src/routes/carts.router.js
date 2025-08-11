import { Router } from "express"
import CartsManager from "../../managers/CartManager.js"

const cartsRouter = Router()

cartsRouter.post('/', (req, res) => {
    try {
        const obj = req.body
        if (typeof (obj) != 'object') throw new Error("Datos en formato incorrecto")
        res.status(200).json(service.post(obj))
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})


cartsRouter.get("/:cid", (req, res) => {
    try {
        const { cid } = req.params
        res.status(200).json(service.getById(cid));
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


cartsRouter.put("/:cid", (req, res) => {
    try {
        const cid = req.params
        let products = req.body
        products = carts.products
        (!products)
    } catch (err) {
    }
})

cartsRouter.delete('/:cid', (req, res) => {
    try {
        const cid = req.params.cid
        //traer contenido de la base de datos y reemplazarlo por el nuevo contenido sin el carrito eliminado
    
    } catch (error) {
        res.status(404).json({
            message: `Error al eliminar el carrito con ${cid}`
        })
    }
})

cartsRouter.delete('/:cid/products/:pid', (req, res) => {
    try {
        const {cid, pid} = req.params
        //traer contenido de la base de datos y reemplazarlo por el nuevo contenido sin el producto especifico eliminado
    

    } catch (error) {
        res.status(404).json({
            message: `Error al eliminar el carrito con ${cid}`
        })
    }
})

export default cartsRouter