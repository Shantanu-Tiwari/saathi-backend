import express from 'express';
import { googleAuth, googleCallback, verifyGoogleCredential, getMe, updateMe, protect, restrictTo } from '../controllers/googleAuthController.js';

const router = express.Router();

// Google OAuth routes (redirect-based)
router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);

// Google JWT credential verification (for Sign-In button)
router.post('/google/verify', verifyGoogleCredential);

// User profile routes
router.route('/me')
    .get(protect, getMe)
    .patch(protect, updateMe);

export default router;
