import express from 'express';
import { bookAppointment, getAppointments } from '../controllers/appointmentController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   POST /api/v1/appointments
// @desc    Book a new appointment
// @access  Private
router.post('/', authMiddleware, bookAppointment);

// @route   GET /api/v1/appointments
// @desc    Get all appointments for the current user
// @access  Private
router.get('/', authMiddleware, getAppointments);

export default router;