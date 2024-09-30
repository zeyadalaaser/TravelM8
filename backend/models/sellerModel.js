import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const sellerSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    immutable: true,
  },
 
  name: {
    type: String,
  },
  description: {
    type: String,
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
  isAccepted: {
    type: Boolean,
    default: false,
  },
}, 
    { 
    timestamps: true 
    });

    sellerSchema.pre('save', async function (next) {
      if (!this.isModified('password')) {
          next();
      }
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    });

const Seller= mongoose.model("Seller", sellerSchema);
export default Seller;
