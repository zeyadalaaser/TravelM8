import Complaints from '../models/complaintsModel.js';



export const createComplaint = async (req, res) => {
    try {
        const { title, body, date } = req.body;

        const newComplaint = new Complaints({
            title,
            body,
            date: date || new Date() 
        });

        const savedComplaint = await newComplaint.save();

        res.status(201).json(savedComplaint);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

  export const getComplaints = async (req, res) => {
   
    try{
       const complaints = await Complaints.find({});
       res.status(200).json(complaints);
    }catch(error){
       res.status(400).json({error:error.message});
    }
 };