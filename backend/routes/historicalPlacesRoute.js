import express from "express";
import { 
    createHistoricalPlace ,
    getAllHistoricalPlaces,
    deleteHistoricalPLace,
    updateHistoricalPLace,
    createTags,
    getTourById,
    getMyGovernor,
    filterbyTags,
    getMyPlaces}
 from "../controllers/historicalPlacesController.js"; 

 import verifyToken from '../services/tokenDecodingService.js'

const router = express.Router();


router.get("/getPlace/:id",getTourById)
router.get('/getMyGovernor', verifyToken, getMyGovernor);
router.post("/addPlace",verifyToken , createHistoricalPlace);  
router.get("/getAllPlaces", getAllHistoricalPlaces);    
router.put("/updatePlace/:id", updateHistoricalPLace); 
router.delete("/deletePlace/:id", deleteHistoricalPLace); 
router.put("/createTag/:id",createTags);
router.get("/filterbyTags",filterbyTags);
router.get("/myPlaces",verifyToken, getMyPlaces); // Retrieve my places


export default router;