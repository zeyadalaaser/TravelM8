import mongoose from "mongoose";

const itineraySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: true,
    },

    activities: [
        {
            type: String,
            required: true,
        },
    ],

    historicalSites: [
        {
            type: String,
            required: true,
        },
    ],

    tourLanguage: {
        type: String,
        required: true,
    },

    price: {
        type: Number,
        required: true,
        min: 0,
    },

    timeline: [
        {
            event: {
                type: String,
                required: true,
            },
            startTime: {
                type: Date,
                required: true,
            },
            endTime: {
                type: Date,
                required: true,
            },
        },
    ],

    availableSlots: [
        {
            date: {
                type: Date,
                required: true,
            },
            numberOfBookings: {
                type: Number,
                default: 0,
            },
            maxNumberOfBookings: {
                type: Number,
                default: 0,
            },
            //have remaining spots
        },
    ],

    accessibility: {
        type: String,
        required: true,
    },

    pickUpLocation: {
        type: String,
        required: true,
    },

    dropOffLocation: {
        type: String,
        required: true,
    },

    tags: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "PreferenceTag",
            required: true,
        },
    ],

    tourGuideId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TourGuide",
        required: true,
    },
});

const Itinerary = mongoose.model("Itinerary", itineraySchema);
export default Itinerary;
