const mongoose = require("mongoose");

const touristSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

module.exports = mongoose.model("Tourist", touristSchema);
