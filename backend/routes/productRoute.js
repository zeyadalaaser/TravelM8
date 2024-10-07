// routes/productRoutes.js
import express from 'express';
import { createProduct, deleteProduct, getAllProducts, updateProduct, getMyProducts } from '../controllers/productController.js';
import verifyToken from '../services/tokenDecodingService.js';

const router = express.Router();


router.post('/',verifyToken, createProduct);
router.delete('/:id', deleteProduct);
router.get('/', getAllProducts); 
router.put('/:id', updateProduct);
router.get('/myProducts', verifyToken, getMyProducts)

export default router;
