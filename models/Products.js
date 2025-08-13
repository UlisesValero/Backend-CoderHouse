import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

export const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: {
        type: Number,
        min: 0
    },
    code: {
        type: String,
    },
    stock: {
        type: Number,
        min: 0
    },
    category: String
})

productSchema.plugin(mongoosePaginate)
export const productModel = mongoose.model('products', productSchema)

