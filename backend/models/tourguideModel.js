import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from "validator";
//import Tourist from './touristModel';

const tourGuideSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    immutable: true,
    match: /^[a-zA-Z0-9]{3,16}$/,
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
    validate: function(value) {
      return /[a-zA-Z]/.test(value) && /\d/.test(value);
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
