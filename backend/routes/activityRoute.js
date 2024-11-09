import express from "express";
import { 
    createNewActivity, 
    getAllActivities, 
    getActivityById,
    getMyActivities,
    updateActivity,
    deleteActivity,
    createManualActivity
    //readActivities,
} from "../controllers/activityController.js"; 
import verifyToken from "../services/tokenDecodingService.js";

const router = express.Router();

router.get("/activities", getAllActivities); // Retrieve all activities
router.get("/activities/:id", getActivityById); // Retrieve a single activity by ID
router.get("/activities/myActivities", verifyToken, getMyActivities); // Retrieve all activities
router.post("/activities", verifyToken ,createNewActivity); // Create a new activity
router.put("/activities/:id", updateActivity); // Update an activity by ID
router.delete("/activities/:id", deleteActivity); // Delete an activity by ID
// router.post("/activities/manualActivity" ,createManualActivity); // Create a new activity

//router.get("/AllActivities",readActivities);

export default router;