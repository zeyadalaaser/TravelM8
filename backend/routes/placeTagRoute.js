import express from "express";
import { getAllTags, createTag } from "../controllers/placeTagController.js"; // Adjust the import path

const router = express.Router();

router.get("/placetag", getAllTags); 
router.post("/placetag", createTag);

export default router;