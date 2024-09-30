import mongoose from "mongoose";

const tourismGovernorSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // You can add more fields here if necessary
});

const TourismGovernor = mongoose.model(
  "TourismGovernor",
  tourismGovernorSchema
);
export default TourismGovernor;
