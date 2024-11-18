import express from "express";

import {
  createItinerary,
  readItineraries,
  updateItinerary,
  deleteItinerary,
  filterItineraries,
  getMyItineraries,
  searchItems2,
  flagItinerary,
  fetchItinerary,
  rateItinerary

} from "../controllers/itineraryController.js";

import verifyToken from "../services/tokenDecodingService.js";
import { adminOnly } from "../middlewares/adminOnlyMiddleware.js";
import { getSalesReport } from "../controllers/itineraryController.js";
//import { protect } from "../middleware/adminOnlyMiddleware.js"; // Assuming you have a middleware for authentication
const router = express.Router();

// router.post("/itineraries", verifyToken, createItinerary); // Create a new itinerary
router.post("/itineraries",verifyToken, createItinerary); // Create a new itinerary
router.get("/itineraries", readItineraries); // Retrieve all itineraries
router.put("/itineraries/:id", updateItinerary); // Update an itinerary by ID
router.delete("/itineraries/:id", deleteItinerary); // Delete an itinerary by ID
router.get("/myItineraries", verifyToken, getMyItineraries); // Retrieve my itineraries
router.get("/FilterItineraries", filterItineraries);
router.get("/searchItineraries", searchItems2);
// Adjust this line in your routes file
router.put("/itineraries/:id/flag", flagItinerary);
router.get("/itineraries/:id", fetchItinerary)
//router.filter("/itineraries/:id",filterItineraries);


 router.post("/itineraries", verifyToken, createItinerary); // Create a new itinerary
 router.get("/itineraries", readItineraries); // Retrieve all itineraries
 router.put("/itineraries/:id", updateItinerary); // Update an itinerary by ID
 router.delete("/itineraries/:id", deleteItinerary); // Delete an itinerary by ID
 router.get("/myItineraries", verifyToken, getMyItineraries); // Retrieve my itineraries
 router.get("/FilterItineraries",filterItineraries);
 router.get("/searchItineraries",searchItems2);
 router.post("/itineraries/rate", rateItinerary);
 //router.filter("/itineraries/:id",filterItineraries);
 router.get("/sales-report", verifyToken, getSalesReport);

export default router;
