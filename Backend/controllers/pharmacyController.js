import Pharmacy from '../models/Pharmacy.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

// Get all pharmacies
export const getAllPharmacies = catchAsync(async (req, res, next) => {
    const pharmacies = await Pharmacy.find().populate('pharmacist', 'name');

    res.status(200).json({
        status: 'success',
        results: pharmacies.length,
        data: {
            pharmacies,
        },
    });
});

// Get a single pharmacy by ID
export const getPharmacy = catchAsync(async (req, res, next) => {
    const pharmacy = await Pharmacy.findById(req.params.id);

    if (!pharmacy) {
        return next(new AppError('No pharmacy found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            pharmacy,
        },
    });
});

// Pharmacist can update their own inventory
export const updateInventory = catchAsync(async (req, res, next) => {
    const { medicine, inStock } = req.body;
    const pharmacistId = req.user.id;

    const pharmacy = await Pharmacy.findOne({ pharmacist: pharmacistId });

    if (!pharmacy) {
        return next(new AppError('You are not registered as a pharmacy owner.', 403));
    }

    pharmacy.inventory.set(medicine, inStock);
    await pharmacy.save();

    res.status(200).json({
        status: 'success',
        message: 'Inventory updated successfully.',
        data: {
            pharmacy,
        },
    });
});

// New function: Get the list of prescriptions sent to the pharmacy
export const getPrescriptionQueue = catchAsync(async (req, res, next) => {
    const pharmacistId = req.user.id;

    const pharmacy = await Pharmacy.findOne({ pharmacist: pharmacistId }).populate({
        path: 'prescriptionQueue',
        populate: {
            path: 'patient',
            select: 'name mobile'
        }
    });

    if (!pharmacy) {
        return next(new AppError('You are not registered as a pharmacy owner.', 403));
    }

    res.status(200).json({
        status: 'success',
        results: pharmacy.prescriptionQueue.length,
        data: {
            prescriptionQueue: pharmacy.prescriptionQueue,
        },
    });
});