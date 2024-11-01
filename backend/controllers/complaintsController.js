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