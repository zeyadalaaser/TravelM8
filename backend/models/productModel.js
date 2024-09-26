import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    Name:{
        type: String,
        required: true 
    },

    Image:{
        type: String,
        required: true
    },

    Price:{
        type: Number,
        required: true,
        min: 0   //3amaltaha 3alashan a validate en cannot have negative number
    },

    Quantity:{
        type: Number,
        required: true
    },

    Description:{
        type: String,
        default: null
    },

    Seller: {
        type: String,
        enum: ['VTP', 'External Seller'], 
        required: true
      },

    Rating:{
        type: Number,
        default: null,
        min: 0,
        max: 5
    },

    Reviews:{
        type: String,
        default: null
    }

},{
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);
export default Product;