import { Router } from "express"
import { cartModel } from '../../models/Carts.js'
import { productModel } from "../../models/Products.js"

const cartsRouter = Router()


cartsRouter.post('/', async (req, res) => {
    try {
        const obj = req.body
        if (typeof (obj) != 'object') throw new Error("Datos en formato incorrecto")
        res.status(200).json(await cartModel.create({obj}))
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

cartsRouter.post('/:cid/products/:pid', async (req, res) => {
    try {
        const {cid, pid} = req.params
        let cart = {}
        try {
            cart = await cartModel.findById(cid)
            
        } catch (error) {
            console.log(error)
            throw new Error("No se encontró un carrito con ese id")
        }
        

        let product = {}
        try {
            product = await productModel.findById(pid)
        } catch (error) {
            throw new Error("No se encontró un producto con ese ID")
        }

        const existingProduct = cart.products.find((p) => p.product.code === product.code)
         if(existingProduct) {
            existingProduct.quantity++
         } else {
            cart.products.push({
                quantity : 1,
                product: product
            })
         }

         await cart.save()

        res.status(200).json(cart)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})


cartsRouter.get("/:cid", async (req, res) => {
    try {
        const { cid } = req.params
        res.status(200).json(await cartModel.findById(cid))
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


cartsRouter.put("/:cid",async (req, res) => {
    try {
        const cid = req.params
        cart = await cartModel.findById(cid)
        cart.products = req.body
        res.status(200).json({cart})
    } catch (err) {
        res.status(400).json({
            message: "No se pudo actualizar el carrito."
        })
    }
})

cartsRouter.put("/:cid/products/:pid", async (req, res) => {
    try {
        const { quantity } = req.body
        const {pid, cid} = req.params
        const cart = await cartModel.findById(cid)
        if(!cart) console.log("No se encontró un carrito con ese ID")

        const product = await productModel.findById(pid)
        if(!product) {
            return res.status(400).json({
                message: `El producto con el ID ${pid} no existe`
            })
        }

        //aunque no coincida el pid con los productos que hay en el carrito, se actualiza uno random a la cantidad que se le manda por el body

        const existingCart = cart.products.find((c) => c.code === cart.code)
        if(existingCart) {
            existingCart.quantity = quantity
        } else {
            console.log(`El producto con el código ${pid} no existe dentro del carrito con ID ${cid}`)
        }
        
        await cart.save()
        res.status(200).json({
            message: cart
        })
    } catch (err) {
        res.status(400).json({
            message: err.message
        })
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

