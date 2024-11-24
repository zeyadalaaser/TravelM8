import express from 'express';
import { purchaseProduct, getPurchasesByTourist, deletePurchase,getProductsReport} from '../controllers/purchaseController.js';

const router = express.Router();

router.post('/purchases', purchaseProduct);
router.get('/purchases/:touristId', getPurchasesByTourist);
//router.post('/purchases/:purchaseId/rate', rateProduct); 
router.delete('/purchases/:purchaseId', deletePurchase);
router.get('/purchasesReport', getProductsReport);
export default router;
