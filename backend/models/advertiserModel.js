import mongoose from 'mongoose';

const advertiserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  website: {
    type: String,
    required: false,
    unique: true,
  },
  hotline: {
    type: Number,
    required: false,
    unique: true,
  },
  
  
 
}, 
    { 
    timestamps: true 
    });



const Advertiser= mongoose.model("Advertiser", advertiserSchema);
export default Advertiser;//.model("collection name",schema)=creates a model from a schema, which maps to a specific collection in the MongoDB database.
