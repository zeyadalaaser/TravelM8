import mongoose from 'mongoose';
import { notifyProductOutOfStock } from '../controllers/notificationController.js';
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

    sales:{
        type: Number,
        default: 0
    },

    description:{
        type: String,
        default: null
    },

    archived:{
        type: Boolean,
        default: false
    },

    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller',
        required: true
      }


},{
    timestamps: true
});
productSchema.post('save', async function (doc) {
  if (doc.quantity === 0) {
      try {
          await notifyProductOutOfStock(doc); 
      } catch (error) {
          console.error('Error notifying product out of stock:', error);
      }
  }
});


const Product = mongoose.model('Product', productSchema);
export default Product;