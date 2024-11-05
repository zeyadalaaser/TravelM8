import mongoose from 'mongoose';

const imageDetailsSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['Advertiser', 'Aeller', 'Tourguide'],  // Ensure the type is one of these values
  },
});

const imageDetailsModel = mongoose.model('ImageDetails', imageDetailsSchema);
export default imageDetailsModel;
