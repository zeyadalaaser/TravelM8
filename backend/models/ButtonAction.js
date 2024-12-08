import mongoose from 'mongoose';

const buttonActionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'itemType'
    },
    itemType: {
        type: String,
        required: true,
        enum: ['Activity', 'Itinerary']
    },
    actionType: {
        type: String,
        required: true,
        enum: ['NOTIFY', 'BOOKED']
    },
    status: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const ButtonAction = mongoose.model('ButtonAction', buttonActionSchema);