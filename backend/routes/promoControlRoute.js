import express from 'express';
import {
  createPromoCode,
  getAllPromoCodes,
  getPromoCode,
  updatePromoCode,
  deletePromoCode,
  checkPromoCodeValidity,
} from '../controllers/promoCodeController.js';

const router = express.Router();

router.post('/promo-codes', createPromoCode); // Create a new promo code
router.get('/promo-codes', getAllPromoCodes); // Get all promo codes
router.get('/promo-codes/:id', getPromoCode); // Get a promo code by ID
router.put('/promo-codes/:id', updatePromoCode); // Update a promo code by ID
router.delete('/promo-codes/:id', deletePromoCode); // Delete a promo code by ID
router.post('/use-promo-code', checkPromoCodeValidity); // Check promo code validity

export default router;
