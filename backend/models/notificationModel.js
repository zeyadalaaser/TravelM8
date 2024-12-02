import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    required: false,
  },
  message: {
    type: String,
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  metadata: {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    productName: String,
  },
},{
  timestamps: true,

});

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;