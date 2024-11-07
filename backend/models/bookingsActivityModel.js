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
  status: {
    type: String,
    enum: ['booked', 'completed'],
    default: 'booked',
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: false, 
  },
  comment: {
    type: String,
    trim: true,
    required: false, 
  },
});

const BookingActivity = mongoose.model('BookingActivity', bookingActivitySchema);
export default BookingActivity;
