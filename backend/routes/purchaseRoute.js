import express from 'express';
import { purchaseProduct, getPurchasesByTourist, rateProduct} from '../controllers/purchaseController.js';

const router = express.Router();

router.post('/purchases', purchaseProduct);
router.get('/purchases/:touristId', getPurchasesByTourist);
router.post('/purchases/:purchaseId/rate', rateProduct); 
export default router;
