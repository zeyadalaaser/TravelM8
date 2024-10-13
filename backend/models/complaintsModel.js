import mongoose from 'mongoose';


const complaintsSchema = new mongoose.Schema({
    
    title: {
        type: String,
        required: true,
        index: true,
    },
    body: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now,
    }
   
}, { timestamps: true });

const Complaints = mongoose.model("Complaints", complaintsSchema);
export default Complaints;