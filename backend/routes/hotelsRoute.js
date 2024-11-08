import express from "express";
import { getHotels, getHotelsToken } from "../controllers/hotelsController.js";

const router = express.Router();

router.get("/getHotelsToken", getHotelsToken);
router.post("/getHotels", getHotels);

export default router;