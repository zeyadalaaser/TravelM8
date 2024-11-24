import mongoose from "mongoose";
import {
  validateUsername,
  validatePassword,
} from "../services/validators/validators.js";


const tourismGovernorSchema = new mongoose.Schema({
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
  }
},
{
  timestamps: true
});


const TourismGovernor = mongoose.model(
  "TourismGovernor",
  tourismGovernorSchema
);
export default TourismGovernor;
