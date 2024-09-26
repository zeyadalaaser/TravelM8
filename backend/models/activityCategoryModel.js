const mongoose = require("mongoose");

const activityCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  // Remove description field
});

const ActivityCategory = mongoose.model(
  "ActivityCategory",
  activityCategorySchema
);
module.exports = ActivityCategory;
