import express from 'express';
import { buttonActionController } from '../controllers/buttonActionController.js';
import verifyToken from '../services/tokenDecodingService.js';

const router = express.Router();

// Toggle action status
router.post('/toggle', 
    verifyToken, 
    buttonActionController.toggleAction
);

// Check status for specific item
router.get('/status/:itemId', 
    verifyToken, 
    buttonActionController.checkActionStatus
);

// Get all actions for logged-in user
router.get('/user', 
    verifyToken, 
    buttonActionController.getUserActions
);

export default router;