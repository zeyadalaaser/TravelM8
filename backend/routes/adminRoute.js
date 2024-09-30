import expresss from 'express';
import {registerAdmin, deleteAccount} from '../controllers/adminController.js';

const router =expresss.Router();

// Admin Registration Route

router.post("/api/admins/register", registerAdmin);
router.delete("/api/admins/:username", deleteAccount);

// router.delete("/api/delete-user/:username", deleteAccount);

export default router;
