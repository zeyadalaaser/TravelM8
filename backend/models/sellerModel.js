import mongoose from 'mongoose';

const sellerSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
 
  name: {
    type: String,
    required: false,
    unique: true,
  },
  description: {
    type: String,
    required: false,
    unique: true,
  },
  
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
//   role: {
//     type: String,
//     enum: ['tourist', 'tour_guide', 'advertiser', 'seller'],
//     required: false,
//   },
  // Fields for tourists only
  
 
}, 
    { 
    timestamps: true 
    });



const Seller= mongoose.model("Seller", sellerSchema);
export default Seller;
