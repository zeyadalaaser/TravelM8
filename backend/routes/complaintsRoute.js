import express from "express";
import {
  createComplaint,
  getComplaints,
  getMyComplaints,
} from "../controllers/complaintsController.js";
import verifyToken from "../services/tokenDecodingService.js";

const complaintRoute = express.Router();

complaintRoute.post("/complaints", verifyToken, createComplaint);
complaintRoute.get("/complaints", getComplaints);
complaintRoute.get("/complaints/myComplaints", verifyToken, getMyComplaints);

export default complaintRoute;
