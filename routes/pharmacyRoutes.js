import express from 'express';
import * as pharmacyController from '../controllers/pharmacyController.js';
import * as authController from '../controllers/authController.js';

const router = express.Router();

router.route('/').get(pharmacyController.getAllPharmacies);

// Routes below this line require authentication
router.use(authController.protect);

router.route('/update-inventory').patch(authController.restrictTo('pharmacist'), pharmacyController.updateInventory);

// New route for pharmacists to view their prescription queue
router.route('/prescription-queue').get(authController.restrictTo('pharmacist'), pharmacyController.getPrescriptionQueue);

router.route('/:id').get(pharmacyController.getPharmacy);

export default router;