import expresss from "express";
import {
  createPreferenceTag,
  getAllPreferenceTags,
  updatePreferenceTag,
  deletePreferenceTag,
} from "../controllers/preferenceTagsController.js";

const router = expresss.Router();

router.post("/Create-Tag", createPreferenceTag);
router.get("/GetAll-Tag", getAllPreferenceTags);
router.put("/UpdateTag", updatePreferenceTag);
router.delete("/DeleteTag", deletePreferenceTag);

export default router;
