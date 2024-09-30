import express from "express";
import {
  createActivityCategory,
  getAllActivityCategories,
  updateActivityCategory,
  deleteActivityCategory,
} from "../controllers/activityCategoryController.js";

const router = express.Router();

// Activity Category CRUD Routes
router.post("/api/activity-categories", createActivityCategory);
router.get("/api/activity-categories", getAllActivityCategories);
// router.put("/api/activity-category", updateActivityCategory); // if we're updating by name
//router.delete("/api/activity-category", deleteActivityCategory); // if we're deleting by name
// router.put("/api/activity-categories/:id", updateActivityCategory); // if we're updating by id
router.delete('/activity-categories/:id', deleteActivityCategory);

export default router;
