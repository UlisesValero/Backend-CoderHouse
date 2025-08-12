// import mongoosePaginate from 'mongoose-paginate-v2'
import { productSchema } from './Products.js'
import mongoose from 'mongoose'


const cartSchema = new mongoose.Schema({
    products: [{
        product: {
            type: productSchema,
            ref: 'product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
            default: 1
        } 
    }]
})

export const cartModel = mongoose.model('Cart', cartSchema)

