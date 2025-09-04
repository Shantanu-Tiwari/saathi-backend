import express from 'express';
import { createPrescription, getPrescriptions } from '../controllers/prescriptionController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   POST /api/v1/prescriptions
// @desc    Create a new prescription
// @access  Private (Doctor only)
router.post('/', authMiddleware, createPrescription);

// @route   GET /api/v1/prescriptions
// @desc    Get prescriptions for the logged-in user
// @access  Private
router.get('/', authMiddleware, getPrescriptions);

export default router;
