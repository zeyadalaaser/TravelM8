import mongoose from 'mongoose';
import TourGuide from './tourguideModel.js'
import Itinerary from './itineraryModel.js'
import Tourist from './touristModel.js'
const Schema = mongoose.Schema;

const bookingsSchema = new Schema({
  tourist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tourist',
    required: true,
    index: true,
  },
  itinerary: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Itinerary',
    required: true,
    index: true,
  },
  tourGuide: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TourGuide',
    required: true,
    index: true,
  },
  bookingDate: {
    type: Date,
    default: Date.now,
  },
  tourDate: {
    type: Date,
    required: true,
  },
  completionStatus: {
    type: String,
    enum: ['Pending', 'Completed', 'Cancelled'],
    default: 'Pending',
  },
  ratingGiven: {
    type: Boolean,
    default: false,
  },
 
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingsSchema);
export default Booking;
