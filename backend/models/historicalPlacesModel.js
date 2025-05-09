import mongoose from "mongoose";
import tourismGovernor from "./tourismGovernorModel.js";
const HistoricalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  location: {
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
  },

  image: {
    type: String,
    required: true,
  },

  openingHours: {
    open: { type: String, required: true },
    close: { type: String, required: true },
  },

  price: [
    {
      type: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
        validate: {
          validator: (v) => v > 0,
          message: "Regular price must be a positive number!",
        },
      },
    },
  ],

  // type: Number,
  // required: true,
  // validate: {
  //   validator: (v) => v > 0,
  //   message: "Price must be a positive number!"
  // }

  tags: {
    type:String,
    ref:"PlaceTag",
    required:true
  },

  tourismGovernorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "tourismGovernor",
    required: true,
  },
});

const HistoricalPlaces = mongoose.model("HistoricalPlaces", HistoricalSchema);
export default HistoricalPlaces;
