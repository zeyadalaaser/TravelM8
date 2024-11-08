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
 
});

const BookingActivity = mongoose.model('BookingActivity', bookingActivitySchema);
export default BookingActivity;
