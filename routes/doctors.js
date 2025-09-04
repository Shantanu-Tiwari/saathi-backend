import express from 'express';
import { getDoctors } from '../controllers/doctorController.js';

const router = express.Router();

// @route   GET /api/v1/doctors
// @desc    Get all available doctors
// @access  Public
router.get('/', getDoctors);

export default router;