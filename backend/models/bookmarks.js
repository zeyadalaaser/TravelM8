import mongoose from 'mongoose';

const bookmarkSchema = new mongoose.Schema({
  touristId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tourist',
    required: true,
  },
  // Make the reference dynamic
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    // This will be either 'Activity' or 'Itinerary'
    refPath: 'itemType'
  },
  itemType: {
    type: String,
    required: true,
    enum: ['Activity', 'Itinerary']
  },
  bookmark: {
    type: Boolean,
    default: false,
  },
});

const Bookmark = mongoose.model('Bookmark', bookmarkSchema);
export default Bookmark;