import expresss from 'express';
import {registerAdmin, deleteAccount} from "./backend/controllers/userController.js"

const router =expresss.Router();

// Admin Registration Route
router.post("/register", registerAdmin);
router.delete("/api/delete-user/:username", deleteAccount);

export default router;
