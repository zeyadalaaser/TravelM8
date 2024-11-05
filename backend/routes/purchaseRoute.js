import express from 'express';
import { purchaseProduct, getPurchasesByTourist } from '../controllers/purchaseController.js';

const router = express.Router();

router.post('/purchases', purchaseProduct);
router.get('/purchases/:touristId', getPurchasesByTourist);

export default router;
