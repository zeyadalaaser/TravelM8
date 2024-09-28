import mongoose from 'mongoose';

const touristSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const Tourist = mongoose.model("Tourist", touristSchema);
export default Tourist;