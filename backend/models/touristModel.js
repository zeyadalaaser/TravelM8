import mongoose from "mongoose";

const touristGovernorSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // You can add more fields here if necessary
});

const TouristGovernor = mongoose.model(
  "TouristGovernor",
  touristGovernorSchema
);
export default TouristGovernor;
