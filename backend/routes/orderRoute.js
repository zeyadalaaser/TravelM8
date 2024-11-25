import express from 'express';
import { createPaymentIntent, payWithStripe, payWithCash, payWithWallet, getWalletBalance } from '../controllers/orderController.js';
import verifyToken from "../services/tokenDecodingService.js";
const router = express.Router();

router.post('/api/products/pay-with-stripe', verifyToken, payWithStripe);
router.post('/api/products/pay-with-cash', verifyToken, payWithCash);
router.post('/create-payment-intent', createPaymentIntent);
router.post('/api/products/pay-with-wallet', verifyToken, payWithWallet);
router.get('/wallet-balance', verifyToken, getWalletBalance);

export default router;