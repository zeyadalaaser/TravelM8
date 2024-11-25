import mongoose from 'mongoose';
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
  price: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ['Wallet', 'Card'],
  },
  completionStatus: {
    type: String,
    enum: ['Paid', 'Cancelled'],
    default: 'Paid',
  },
  ratingGiven: {
    type: Boolean,
    default: false,
  },
 
});

const Booking = mongoose.model('Booking', bookingsSchema);
export default Booking;
