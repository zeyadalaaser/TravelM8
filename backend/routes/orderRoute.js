import express from 'express';
import { createPaymentIntent, payWithStripe, payWithCash } from '../controllers/orderController.js';
import verifyToken from "../services/tokenDecodingService.js";
const router = express.Router();

router.post('/api/products/pay-with-stripe', verifyToken, payWithStripe);
router.post('/api/products/pay-with-cash', verifyToken, payWithCash);
router.post('/create-payment-intent', createPaymentIntent);

export default router;