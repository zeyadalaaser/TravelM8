import mongoose from 'mongoose';
import Product from './productModel.js';
import Tourist from './touristModel.js';

const purchaseSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    touristId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tourist', 
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    totalPrice: {
      type: Number,
      required: false,
      min: 0,
    },
    status: {
      type: String,
      enum: ['completed', 'pending', 'cancelled'],
      default: 'completed',
    },
   
  },
  {
    timestamps: true, 
  }
);

const Purchase = mongoose.model('Purchase', purchaseSchema);
export default Purchase;
