import HealthRecord from '../models/HealthRecord.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

// Allows a doctor to create a new health record
export const createHealthRecord = catchAsync(async (req, res, next) => {
    // Check if the user is a doctor
    if (req.user.role !== 'doctor') {
        return next(new AppError('Only doctors can create health records.', 403));
    }

    const newRecord = await HealthRecord.create({
        ...req.body,
        doctor: req.user.id, // Set the doctor field to the logged-in user's ID
    });

    res.status(201).json({
        status: 'success',
        data: {
            healthRecord: newRecord,
        },
    });
});

// Allows a patient to view their own records or a doctor to view their created records
export const getHealthRecords = catchAsync(async (req, res, next) => {
    let filter = {};

    // If the user is a patient, show only their records
    if (req.user.role === 'patient') {
        filter = { patient: req.user.id };
    }
    // If the user is a doctor, show only the records they've created
    else if (req.user.role === 'doctor') {
        filter = { doctor: req.user.id };
    } else {
        // For any other role, deny access
        return next(new AppError('You do not have permission to view health records.', 403));
    }

    const records = await HealthRecord.find(filter)
        .populate('patient', 'name')
        .populate('doctor', 'name');

    res.status(200).json({
        status: 'success',
        results: records.length,
        data: {
            healthRecords: records,
        },
    });
});

// A function to get a single health record by ID
export const getHealthRecordById = catchAsync(async (req, res, next) => {
    const record = await HealthRecord.findById(req.params.id)
        .populate('patient', 'name')
        .populate('doctor', 'name');

    if (!record) {
        return next(new AppError('No health record found with that ID', 404));
    }

    // Access control to ensure only the patient or doctor associated can view it
    if (record.patient.id !== req.user.id && record.doctor.id !== req.user.id) {
        return next(new AppError('You do not have permission to view this record.', 403));
    }

    res.status(200).json({
        status: 'success',
        data: {
            healthRecord: record,
        },
    });
});