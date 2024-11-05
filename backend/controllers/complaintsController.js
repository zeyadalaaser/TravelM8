import Complaints from "../models/complaintsModel.js";
import mongoose from "mongoose";

export const createComplaint = async (req, res) => {
  try {
    const { title, body, date } = req.body;

    const newComplaint = new Complaints({
      title,
      body,
      date,
      touristId: req.user.userId,
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
    if (complaints.length == 0) res.status(204);
    else res.status(200).json({ complaints });
  } catch (error) {
    res.status(400).json({ message: "enter a valid id" });
  }
};

export const getComplaints = async (req, res) => {
  try {
    const complaints = await Complaints.find({}).populate(
      "touristId",
      "username"
    );
    res.status(200).json(complaints);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateComplaintReply = async (req, res) => {
  const { id } = req.params;
  const { reply, status } = req.body;

  try {
    // Find the complaint by ID and update the reply and status
    const updatedComplaint = await Complaints.findByIdAndUpdate(
      id,
      { reply, status },
      { new: true, runValidators: true }
    );

    if (!updatedComplaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.status(200).json({
      message: "Complaint updated successfully",
      complaint: updatedComplaint,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating complaint", error });
  }
};

// export const filterComplaints = async (req, res) => {
//     try {
//         const { status, startDate, endDate } = req.query;

//         const query = {};

//         // Filter by status if provided and matches either "Pending" or "Resolved"
//         if (status && (status === "Pending" || status === "Resolved")) {
//             query.status = status;
//         }

//         // Filter by date range if startDate and endDate are provided
//         if (startDate || endDate) {
//             query.date = {};
//             if (startDate) {
//                 query.date.$gte = new Date(startDate); // Greater than or equal to startDate
//             }
//             if (endDate) {
//                 query.date.$lte = new Date(endDate); // Less than or equal to endDate
//             }
//         }

//         // Find complaints based on query and sort by date in descending order
//         const complaints = await Complaints.find(query)
//             .populate('touristId')  // Populate tourist details if needed
//             .sort({ date: -1 }); // Sort by date in descending order

//         // Send response with filtered complaints
//         res.status(200).json(complaints);
//     } catch (error) {
//         console.error("Error filtering complaints:", error);
//         res.status(500).json({ message: "Server error. Could not filter complaints." });
//     }
// };
// >>>>>>> main
