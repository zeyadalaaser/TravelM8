import express from 'express';
import { createPaymentIntent, payWithStripe, payWithCash, payWithWallet, cancelOrder, getWalletBalance, checkout, getOrders, updateOrderStatus } from '../controllers/orderController.js';
import verifyToken from "../services/tokenDecodingService.js";
const router = express.Router();

router.post('/products/pay-with-stripe', verifyToken, payWithStripe);
router.post('/products/pay-with-cash', verifyToken, payWithCash);
router.post('/products/pay-with-wallet', verifyToken, payWithWallet);
router.post('/create-payment-intent', createPaymentIntent);
router.get('/user/wallet-balance', verifyToken, getWalletBalance);
router.post("/tourists/checkout", verifyToken, checkout); // User checkout
router.get("/tourists/orders", verifyToken, getOrders); // View user orders
router.put("/tourists/orders/update-status/:id", verifyToken, updateOrderStatus);
router.put("/tourists/orders/cancel-order/:id", verifyToken, cancelOrder);


export default router;