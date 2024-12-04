import mongoose from 'mongoose';
import {
  validateUsername,
  validatePassword,
} from "../services/validators/validators.js";

const adminSchema = new mongoose.Schema({
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
  password: {
    type: String,
    required: true,
    validate: {
      validator: validatePassword,
      message: "Password must contain numbers, letters and min length is 4",
    },
  },
  email: {
    type: String,
    required: false,
    validate: {
      validator: function (email) {
        // Basic email validation regex
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      },
      message: "Invalid email format.",
    },
  },
},
{
  timestamps: true
});

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
