import express from 'express';
import { requestOtp, verifyOtp } from '../controllers/authController.js';

const router = express.Router();

// @route   POST api/v1/auth/request-otp
// @desc    Request a one-time password for a given mobile number
// @access  Public
router.post('/request-otp', requestOtp);

// @route   POST api/v1/auth/verify-otp
// @desc    Verify the OTP and log in the user
// @access  Public
router.post('/verify-otp', verifyOtp);

export default router;

