import express from 'express';
import { createPaymentIntent, payWithStripe, payWithCash, payWithWallet, getWalletBalance,chooseOrAddDeliveryAddress } from '../controllers/orderController.js';
import verifyToken from "../services/tokenDecodingService.js";
const router = express.Router();

router.post('/api/products/pay-with-stripe', verifyToken, payWithStripe);
router.post('/api/products/pay-with-cash', verifyToken, payWithCash);
router.post('/products/pay-with-wallet', verifyToken, payWithWallet);
router.post('/create-payment-intent', createPaymentIntent);
router.get('/user/wallet-balance', verifyToken, getWalletBalance);
router.post('/choose-delivery-address', verifyToken, chooseOrAddDeliveryAddress);

export default router;