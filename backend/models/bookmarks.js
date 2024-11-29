import mongoose from 'mongoose';

const bookmarkSchema = new mongoose.Schema({
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
  bookmark:{
    type: Boolean,
    default:false,
  },
});

const bookmarkActivity = mongoose.model('bookmarkActivity', bookmarkSchema);
export default bookmarkActivity;
