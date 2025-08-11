import mongoosePaginate from 'mongoose-paginate-v2'
import { productSchema } from './Products'


const cartSchema = mongoose.Schema({
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

const cartModel = mongoose.model('carts', cartSchema)

export default cartModel