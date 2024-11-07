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
});

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
