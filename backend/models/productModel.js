import mongoose from 'mongoose';
import Seller from './sellerModel.js'

const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true 
    },

    image:{
        type: String,
        required: true
    },

    price:{
        type: Number,
        required: true,
        min: 0   //3amaltaha 3alashan a validate en cannot have negative number
    },

    quantity:{
        type: Number,
        required: true
    },

    description:{
        type: String,
        default: null
    },

    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller',
        required: true
      },

    sellerType: {
        type: String,
        enum: ['VTP', 'External Seller'],
        required: true
    },

    rating:{
        type: Number,
        default: null,
        min: 0,
        max: 5
    },

    reviews:{
        type: String,
        default: null
    }

},{
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);
export default Product;