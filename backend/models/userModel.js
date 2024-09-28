import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
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
  role: {
    type: String,
    enum: ['tourist', 'tour_guide', 'advertiser', 'seller'],
    required: true,
  },
  // Fields for tourists only
  dob: {
    type: Date,
  },
  mobileNumber: {
    type: String,
  },
  nationality: {
    type: String,
  },
  occupation: {
    type: String, // e.g., 'student' or 'job'
  },
}, 
    { 
    timestamps: true 
    });



const User= mongoose.model("User", userSchema);
export default User;
