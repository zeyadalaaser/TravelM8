import express from "express";
import {
  createActivityCategory,
  getAllActivityCategories,
  updateActivityCategory,
  deleteActivityCategory,
} from "../controllers/activityCategoryController.js";

const router = express.Router();

router.post("/activity-categories", createActivityCategory);
router.get("/activity-categories", getAllActivityCategories);
router.put("/activity-categories", updateActivityCategory); // if we're updating by name
// router.delete("/activity-categories/:id", deleteActivityCategory);
router.delete("/activity-categories", deleteActivityCategory);

export default router;
