import expresss from 'express';
import {registerAdmin, deleteAccount, getUsers, getAllAdmins} from '../controllers/adminController.js';

const router =expresss.Router();

// Admin Registration Route

router.post("/admins/register", registerAdmin);
router.delete("/users", deleteAccount);
router.get("/getallusers", getUsers);
router.get("/admins", getAllAdmins);



export default router;
