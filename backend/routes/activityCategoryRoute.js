import express from "express";
import {
  createActivityCategory,
  getAllActivityCategories,
  updateActivityCategory,
  deleteActivityCategory,
} from "../controllers/activityCategoryController.js";

const router = express.Router();

// Activity Category CRUD Routes
router.post("/api/activity-category", createActivityCategory);
router.get("/api/activity-categories", getAllActivityCategories);
router.put("/api/activity-category", updateActivityCategory); // Changed to use URL params
router.delete("/api/activity-category", deleteActivityCategory); // Changed to use URL params

export default router;
