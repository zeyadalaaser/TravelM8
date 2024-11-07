import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from "validator";

import {
  validateUsername,
  validatePassword,
} from "../services/validators/validators.js";



const tourGuideSchema = new mongoose.Schema({
  name: {
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
      validator: (email) => validator.isEmail(email),
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
    }
  },


  mobileNumber: {
    type: String,
  },
  yearsOfExperience: {
    type: Number,
  },

  previousWork: [
    {
      type: String,
    },
  ],
  languages: [
    {
      type: String,
    },
  ],
  ratings: [
    {
      touristId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tourist",
        required: true,
      },
      rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      comment: {
        type: String,
      },
    },
  ],
}, { 
  timestamps: true 
});

tourGuideSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


const TourGuide = mongoose.model("TourGuide", tourGuideSchema);
export default TourGuide;
