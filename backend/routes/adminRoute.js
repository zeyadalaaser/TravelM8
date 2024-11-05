import expresss from 'express';
import {registerAdmin, deleteAccount, getUsers, getAllAdmins} from '../controllers/adminController.js';
import { changePasswordAdmin } from '../controllers/changePassword.js';
import verifyToken from '../services/tokenDecodingService.js';

const router =expresss.Router();

// Admin Registration Route

router.post("/admins/register", registerAdmin);
router.delete("/users", deleteAccount);
router.get("/getallusers", getUsers);
router.get("/admins", getAllAdmins);
router.post("/admins/changepassword", verifyToken, changePasswordAdmin);



export default router;
