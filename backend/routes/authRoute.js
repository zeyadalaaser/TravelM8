import express from 'express';
import { requestPasswordReset, resetPassword, verifyOTP } from '../controllers/authController.js';

const router = express.Router();

router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);
router.post('/verify-OTP', verifyOTP);

export default router;
