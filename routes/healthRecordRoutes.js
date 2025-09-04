import express from 'express';
import * as healthRecordController from '../controllers/healthRecordController.js';
import * as authController from '../controllers/authController.js';

const router = express.Router();

// All health record routes require a logged-in user
router.use(authController.protect);

router
    .route('/')
    .post(authController.restrictTo('doctor'), healthRecordController.createHealthRecord)
    .get(healthRecordController.getHealthRecords);

router
    .route('/:id')
    .get(healthRecordController.getHealthRecordById);

export default router;