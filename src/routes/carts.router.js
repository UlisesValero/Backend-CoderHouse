import { Router } from "express"
import { cartModel } from '../../models/Carts.js'
import { productModel } from "../../models/Products.js"

const cartsRouter = Router()

// cartsRouter.post('/', async (req, res) => {
//     try {
//         const cart = await cartModel.create({})
//         const cart2 = await cartModel.create({})
//         const cart3 = await cartModel.create({})
//         const cart4= await cartModel.create({})
//         const cart5 = await cartModel.create({})


//     } catch (error) {

//     }
// })

cartsRouter.post('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params
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

        const existingProduct = cart.products.find(p => p.product.code === product.code)
        if (existingProduct) {
            existingProduct.quantity++
        } else {
            cart.products.push({
                quantity: 1,
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

cartsRouter.put("/:cid", async (req, res) => {
    try {
        const { cid } = req.params
        const cart = await cartModel.findById(cid).populate("products.product")
        console.log(cart)
        cart.products = req.body
        await cart.save()
        res.status(200).json({ cart })
    } catch (err) {
        console.log(err)
        res.status(400).json({

            message: "No se pudo actualizar el carrito."
        })
    }
})

cartsRouter.put("/:cid/products/:pid", async (req, res) => {
    try {
        const { quantity } = req.body
        const { pid, cid } = req.params
        let cart = {}
        try {
            cart = await cartModel.findById(cid).lean()

        } catch (error) {
            console.log(error)
            throw new Error("No se encontró un carrito con ese ID")
        }
        let product = {}
        try {
            product = await productModel.findById(pid)
        } catch (error) {
            throw new Error("No se encontró un producto con ese ID")
        }
        const existingProduct = cart.products.find(p => p.product.code === product.code)
        if (existingProduct) {
            let valor0 = existingProduct.quantity += quantity
            if (valor0 < 0) throw new Error('La cantidad no puede ser menor a 0')
        } else {
            res.status(400).json({
                message: `El producto con el ID ${pid} no existe dentro del carrito con ID ${cid}`
            })
        }

        await cartModel.updateOne(cart)
        res.status(200).json({
            message: cart
        })
    } catch (err) {
        res.status(400).json({
            message: err.message
        })
    }
})

cartsRouter.delete('/:cid', async (req, res) => {
    try {
        const cid = req.params.cid
        let cart = {}
        try {
            cart = await cartModel.findById(cid).lean()
        } catch (error) {
            throw new Error("No se encontró un carrito con ese ID")
        }
        cart.products = []
        await cart.save()

        return res.status(200).json({
            message: cart.products
        })
    } catch (error) {
        res.status(404).json({
            message: error.message
        })
    }
})

cartsRouter.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params
        let cart = {}
        try {
            cart = await cartModel.findById(cid).lean()
        } catch (error) {
            throw new Error("No se encontró un carrito con ese ID")
        }
                let product = {}
        try {
            product = await productModel.findById(pid)
        } catch (error) {
            throw new Error("No se encontró un producto con ese ID")
        }

        const existingProduct = cart.products.find(p => p.product.code === product.code)
        existingProduct ? cart.products = cart.products.filter(p => p.product.code != product.code) :
            res.status(400).json({
                message: `No se encontró un producto con ID ${pid} dentro del carrito con ID ${cid}`
            })

        await cartModel.save(cart)
        res.status(200).json({
            message: cart.products
        })

    } catch (error) {
        res.status(404).json({
            message: error.message
        })
    }
})

export default cartsRouter

