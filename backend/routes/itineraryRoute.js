import express from "express";
import { createItinerary, 
    readItineraries, 
    updateItinerary,
    deleteItinerary,
    filterItineraries ,
    getMyItineraries,searchItems2,
    rateItinerary
}
 from "../controllers/itineraryController.js"; 
import verifyToken from "../services/tokenDecodingService.js";

 const router = express.Router();

 router.post("/itineraries", verifyToken, createItinerary); // Create a new itinerary
 router.get("/itineraries", readItineraries); // Retrieve all itineraries
 router.put("/itineraries/:id", updateItinerary); // Update an itinerary by ID
 router.delete("/itineraries/:id", deleteItinerary); // Delete an itinerary by ID
 router.get("/myItineraries", verifyToken, getMyItineraries); // Retrieve my itineraries
 router.get("/FilterItineraries",filterItineraries);
 router.get("/searchItineraries",searchItems2);
 router.post("/itineraries/rate", rateItinerary);
 //router.filter("/itineraries/:id",filterItineraries);

 export default router;