import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from "validator";
import {
  validateUsername,
  validatePassword,
} from "../services/validators/validators.js";

const sellerSchema = new mongoose.Schema({
  
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    immutable: true,
    validate: {
      validator: validateUsername,
      message: "Username must contain numbers, letters and length 3-16",
    },
  },
   
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email) => validator.isEmail(email), // Using Validator.js
      message: 'Please enter a valid email address.',
  },
  },
  password: {
    type: String,
    minlength: 6,
    required: true,
    validate: {
      validator: validatePassword,
      message: "Password must contain numbers, letters and min length is 4",
    },
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
