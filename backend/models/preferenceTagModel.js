import mongoose from 'mongoose';

const preferenceTagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const PreferenceTag = mongoose.model("PreferenceTag", preferenceTagSchema);
export default PreferenceTag;  
