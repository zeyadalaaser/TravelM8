import expresss from "express";
import {
  createPreferenceTag,
  getAllPreferenceTags,
  updatePreferenceTag,
  deletePreferenceTag,
} from "../controllers/preferenceTagController.js";

const router = expresss.Router();

router.post("/preference-tags", createPreferenceTag);
router.get("/preference-tags", getAllPreferenceTags);
router.put("/preference-tags", updatePreferenceTag);
// router.delete("/preference-tags/:id", deletePreferenceTag);
router.delete("/preference-tags", deletePreferenceTag);



export default router;
