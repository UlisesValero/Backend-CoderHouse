// import mongoosePaginate from 'mongoose-paginate-v2'
import { productSchema } from './Products.js'
import mongoose from 'mongoose'


const cartSchema = new mongoose.Schema({
    products: [{
        product: {
            type: productSchema,
            ref: 'products',
        },
        quantity: {
            type: Number,
            min: 1,
            default: 10
        } 
    }]
})

export const cartModel = mongoose.model('Cart', cartSchema)

