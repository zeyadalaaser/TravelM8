import mongoose from 'mongoose';

const bookingActivitySchema = new mongoose.Schema({
  touristId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tourist',
    required: true,
  },
  activityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Activity',
    required: true,
  },
  bookingDate: {
    type: Date,
    required: true,
  },
  completionStatus: {
    type: String,
    enum: ['Paid', 'Cancelled'],
    default: 'Paid',
  },
  price: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ['Wallet', 'Card'],
  }
});

const BookingActivity = mongoose.model('BookingActivity', bookingActivitySchema);
export default BookingActivity;
