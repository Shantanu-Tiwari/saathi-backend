import express from 'express';
import { getMe, updateMe, uploadCredentials, submitCredentials } from '../controllers/userController.js';
import { protect, restrictTo } from '../controllers/authController.js';

const router = express.Router();

// The /me endpoint for logged-in users to manage their profiles
router.route('/me')
    .get(protect, getMe)
    .patch(protect, updateMe);

// The new endpoint for doctors to submit credentials
// The request must be a POST with form-data and a file named "credentials"
router.route('/submit-credentials')
    .post(protect, uploadCredentials, submitCredentials);

export default router;