import Complaints from '../models/complaintsModel.js';
import mongoose from "mongoose";


export const createComplaint = async (req, res) => {
    try {
        const { title, body, date } = req.body;

        const newComplaint = new Complaints({
            title,
            body,
            date,
            touristId: req.user.userId
        });

        const savedComplaint = await newComplaint.save();

        res.status(201).json(savedComplaint);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getMyComplaints = async (req, res) => {
    const userId = req.user?.userId;
    try {
      let complaints;
      complaints = await Complaints.find({ touristId: userId });
      if (complaints.length == 0)
        res.status(204);
      else
        res.status(200).json({ complaints });
    } catch (error) {
      res.status(400).json({ message: "enter a valid id" });
    }
  };

  export const getComplaints = async (req, res) => {
   
    try{
       const complaints = await Complaints.find({}).populate("touristId", "username");;
       res.status(200).json(complaints);
    }catch(error){
       res.status(400).json({error:error.message});
    }
 };
 export const updateComplaintStatus = async (req, res) => {
  const { id } = req.params; // Assuming the complaint ID is passed in the URL
  const { status } = req.body; // Expecting { status: "Pending" | "Resolved" }

  try {
      // Update the complaint status
      const updatedComplaint = await Complaints.findByIdAndUpdate(
          id,
          { status },
          { new: true } // Return the updated document
      );

      if (!updatedComplaint) {
          return res.status(404).json({ message: "Complaint not found" });
      }

      res.status(200).json(updatedComplaint);
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
};