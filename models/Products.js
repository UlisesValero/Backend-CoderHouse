import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

export const productSchema = mongoose.Schema({
    title: String,
    description: String,
    price: {
        type: Number,
        required: true,
        min: 0
    },
    code: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true,
        min: 0
    },
    category: String
})

export const productModel = mongoose.model('products', productSchema)

