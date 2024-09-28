import mongoose from 'mongoose';

const preferenceTagsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const PreferenceTags = mongoose.model("PreferenceTags", preferenceTagsSchema);
export default PreferenceTags;  
