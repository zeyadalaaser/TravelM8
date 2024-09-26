// routes/productRoutes.js
import express from 'express';
import { createProduct } from '../controllers/productController.js';

const router = express.Router();

// Define the POST route for creating a product
router.post('/', createProduct);

export default router;
