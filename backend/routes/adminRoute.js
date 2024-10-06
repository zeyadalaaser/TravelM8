import expresss from 'express';
import {registerAdmin, deleteAccount, getUsers} from '../controllers/adminController.js';

const router =expresss.Router();

// Admin Registration Route

router.post("/admins/register", registerAdmin);
router.delete("/users", deleteAccount);
router.get("/getallusers", getUsers);


export default router;
