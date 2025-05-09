import mongoose from 'mongoose';
import ActivityCategory from './activityCategoryModel.js';
import PreferenceTag from './preferenceTagModel.js';
import Advertiser from './advertiserModel.js'

const activitySchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: true,
    },

    date: {
        type: Date,
        required: true,
    },

    location: {
        name: {
            type: String
        },
        lat: {
            type: Number,
            required: true,
        },
        lng: {
            type: Number,
            required: true,
        }
    },
    
    price: {
        type: mongoose.Schema.Types.Mixed,
        validate: {
            validator: (v) => {
                return (
                    typeof v === 'number' || 
                        ( Array.isArray(v) && v.length === 2 && typeof v[0] === 'number' && typeof v[1] === 'number' && v[0] < v[1])  
                );
            },
            message : "Insert a valid price range!"
        },
        
    },

    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ActivityCategory',
        required: true,
    },

    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PreferenceTag',
        required: true,
    }],

    discount: {
        type: Number,
    },

    isBookingOpen: {
        type: Boolean,
        default:false,
        required: true,
    },

    image: {
        type: String,
        required: true,
    },
    
    advertiserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Advertiser',
        required: true,
    },
    averageRating: {
        type: Number,
        default: 0,
    },
    flagged: {
        type: Boolean,
        default: false,
    },
    
});

const Activity = mongoose.model("Activity", activitySchema);
export default Activity;