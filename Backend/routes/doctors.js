import express from 'express';
import { getDoctors, getDoctorDetails, getDoctorSchedule, addSlot } from '../controllers/doctorController.js';
import { protect, restrictTo } from '../controllers/authController.js';

const router = express.Router();

// This route is public so patients can find doctors without being logged in
router.get('/', getDoctors);

// This route is public so patients can view a specific doctor's details
router.get('/:id', getDoctorDetails);

// Protect all following routes
router.use(protect);

// Only allow doctors to access the following routes
router.use(restrictTo('doctor'));

// Route for the authenticated doctor's schedule
router.route('/me/schedule')
    .get(getDoctorSchedule);

// Route for a doctor to add new slots
router.route('/me/slots')
    .post(addSlot);

export default router;