import mongoose from "mongoose";

const placeTagSchema = new mongoose.Schema({

    type:{
        type:String,
        enum: ["Monument","Palace","Museum","Religious Site"],
        required: true
    },
    historicalPeriod:{
        type:String,
        required: true
    }

})
placeTagSchema.index({ type: 1, historicalPeriod: 1 }, { unique: true });

const PlaceTag = mongoose.model("PlaceTag", placeTagSchema);
export default PlaceTag;  

