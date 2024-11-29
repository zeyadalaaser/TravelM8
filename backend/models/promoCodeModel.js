import mongoose from 'mongoose';


const promoCodeSchema = new mongoose.Schema({
  promoCode: {
    type: String, 
    required: true, 
    unique: true, 
    immutable: true,
  },
  value : {
    type: Number,
    required: true, 
  }
},
);

const PromoCode = mongoose.model("PromoCode", promoCodeSchema);
export default PromoCode;
