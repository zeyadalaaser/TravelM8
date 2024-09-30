import expresss from "express";
import {
  createPreferenceTag,
  getAllPreferenceTags,
  updatePreferenceTag,
  deletePreferenceTag,
} from "../controllers/preferenceTagController.js";

const router = expresss.Router();

router.post("/api/preference-tags", createPreferenceTag);
router.get("/api/preference-tags", getAllPreferenceTags);
router.put("/api/preference-tags/:id", updatePreferenceTag);
router.delete("/api/preference-tags/:id", deletePreferenceTag);



export default router;
