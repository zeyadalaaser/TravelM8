const mongoose = require("mongoose");

const preferenceTagsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const PreferenceTags = mongoose.model("PreferenceTags", preferenceTagsSchema);
module.exports = PreferenceTags;  
