import express from "express";
import {
  createComplaint,
  getComplaints,
  getMyComplaints,
  updateComplaintReply,
} from "../controllers/complaintsController.js";
import verifyToken from "../services/tokenDecodingService.js";

const complaintRoute = express.Router();

complaintRoute.post("/complaints", verifyToken, createComplaint);
complaintRoute.get("/complaints", verifyToken, getComplaints);
complaintRoute.get("/complaints/myComplaints", verifyToken, getMyComplaints);
complaintRoute.put("/complaints/reply/:id", verifyToken, updateComplaintReply);

export default complaintRoute;
