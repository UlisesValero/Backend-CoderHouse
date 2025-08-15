import { Router } from "express"
import { cartModel } from '../../models/Carts.js'
import { productModel } from "../../models/Products.js"

const cartsRouter = Router()

cartsRouter.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params
        const cart = await cartModel.findById(cid).populate("products.product")
        if (!cart) throw new Error("No se encontró un carrito con ese ID")
        res.status(200).json(cart)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

cartsRouter.post('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params
        const cart = cid == 0 ? await cartModel.create({}) : await cartModel.findById(cid)
        console.log(cart)
        console.log(cid)

        if (!cart) throw new Error("No se encontró un carrito con ese ID")

        const product = await productModel.findById(pid)
        if (!product) throw new Error("No se encontró un producto con ese ID")

        const existingProduct = cart.products.find(
            p => p.product && p.product._id.toString() === pid
        )

        if (existingProduct) {
            existingProduct.quantity++
        } else {
            cart.products.push({ quantity: 1, product })
        }

        await cart.save()
        res.status(200).json(cart)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

cartsRouter.put("/:cid", async (req, res) => {
    try {
        const { cid } = req.params
        const cart = await cartModel.findById(cid)
        if (!cart) throw new Error("No se encontró un carrito con ese ID")

        cart.products = req.body
        await cart.save()

        res.status(200).json({
            message: `Carrito con el ID ${cid} fue actualizado con éxito`
        })
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

cartsRouter.put("/:cid/products/:pid", async (req, res) => {
    try {
        const { quantity } = req.body
        const { pid, cid } = req.params
        const cart = await cartModel.findById(cid)
        if (!cart) throw new Error("No se encontró un carrito con ese ID")

        const product = await productModel.findById(pid)
        if (!product) throw new Error("No se encontró un producto con ese ID")

        const existingProduct = cart.products.find(
            p => p.product && p.product._id.toString() === pid
        )
        if (existingProduct) {
            existingProduct.quantity += quantity
            if (existingProduct.quantity < 0)
                throw new Error("La cantidad no puede ser menor a 0")
        } else {
            throw new Error(`El producto con ID ${pid} no está en el carrito`)
        }

        await cart.save()
        res.status(200).json(cart)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

cartsRouter.delete('/:cid', async (req, res) => {
    try {
        const { cid } = req.params
        const cart = await cartModel.findById(cid)
        if (!cart) throw new Error("No se encontró un carrito con ese ID")

        cart.products = []
        await cart.save()

        res.status(200).json({ message: "Carrito vaciado correctamente" })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
})

cartsRouter.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params

        const cart = await cartModel.findById(cid)
        if (!cart) throw new Error("No se encontró un carrito con ese ID")

        const product = await productModel.findById(pid)
        if (!product) throw new Error("No se encontró un producto con ese ID")

        const existingProduct = cart.products.find(
            p => p.product && p.product._id.toString() === pid
        )

        if (!existingProduct) {
            throw new Error(`No se encontró el producto con ID ${pid} en el carrito`)
        }

        cart.products = cart.products.filter(
            p => p.product && p.product._id.toString() !== pid
        )

        await cart.save()
        res.status(200).json({
            message: `Producto con ID ${pid} eliminado del carrito ${cid} con éxito`,
            cart: cart.products
        })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
})

export default cartsRouter
