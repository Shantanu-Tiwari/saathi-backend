import express from 'express';
import { googleAuth, googleCallback, getMe, updateMe, protect, restrictTo } from '../controllers/googleAuthController.js';

const router = express.Router();

// Google OAuth routes
router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);

// User profile routes
router.route('/me')
    .get(protect, getMe)
    .patch(protect, updateMe);

export default router;
