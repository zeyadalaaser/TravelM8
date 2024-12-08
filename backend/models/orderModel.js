import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tourist',
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true
    }
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  deliveryFee: {
    type:Number,
    required:true
  },
  deliveryAddress: {
    fullName: {
      type: String,
      required:true
    },
    mobileNumber: {
      type: String,
      required:true
    },
    streetName: {
      type: String,
      required:true
    },
    buildingNumber: {
      type: String,
      required:true
    },
    city: {
      type: String,
      required:true
    },
    postalCode: {
      type: String,
      required:true
    },
    country: {
      type: String,
      required:true
    },
  },
  paymentMethod: {
    type: String,
    enum: ['credit-card', 'cash',"wallet"],
    required: true
  },
  status: {
    type: String,
    enum: ['Placed', 'Cancelled'],
    default: 'Placed'
  },
  stripePaymentIntentId: {
    type: String
  }
}, { timestamps: true });


const Order = mongoose.model('Order', orderSchema);

export default Order;