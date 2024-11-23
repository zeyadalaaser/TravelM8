import express from 'express';
import { payWithStripe, payWithCash} from '../controllers/orderController.js';
import verifyToken from "../services/tokenDecodingService.js";
const router = express.Router();

router.post('/api/products/pay-with-stripe', verifyToken, payWithStripe);
router.post('/api/products/pay-with-cash', verifyToken, payWithCash);

