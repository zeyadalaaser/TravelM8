import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const advertiserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    immutable: true,
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
  },
  hotline: {
    type: Number,
  },
  
  isAccepted: {
    type: Boolean,
    default: false,
  },
 
}, 
    { 
    timestamps: true 
    });


advertiserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
      next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


const Advertiser= mongoose.model("Advertiser", advertiserSchema);
export default Advertiser;//.model("collection name",schema)=creates a model from a schema, which maps to a specific collection in the MongoDB database.
