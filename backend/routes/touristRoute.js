import expresss from 'express';
import {registerTourist} from '../controllers/touristController.js';

const router =expresss.Router();

// Tourist Registration Route
router.post("/register-tourist", registerTourist);

export default router;

