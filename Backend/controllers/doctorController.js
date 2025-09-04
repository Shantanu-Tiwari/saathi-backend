import User from '../models/User.js';
import Appointment from '../models/Appointment.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import multer from 'multer';

// --- Doctor Endpoints ---

// GET /api/v1/doctors
export const getDoctors = catchAsync(async (req, res) => {
    const doctors = await User.find({ role: 'doctor' }).select('-otp -otpExpires');
    res.status(200).json({
        status: 'success',
        doctors
    });
});

// GET /api/v1/doctors/:id
export const getDoctorDetails = catchAsync(async (req, res, next) => {
    const doctor = await User.findById(req.params.id);

    if (!doctor || doctor.role !== 'doctor') {
        return next(new AppError('Doctor not found.', 404));
    }

    res.status(200).json({
        status: 'success',
        doctor
    });
});

// GET /api/v1/doctors/me/schedule
export const getDoctorSchedule = catchAsync(async (req, res, next) => {
    const doctorId = req.user.id;
    const { date, startDate, endDate } = req.query;

    const query = { doctor: doctorId };

    if (date) {
        const specificDate = new Date(date);
        query.date = specificDate;
    } else if (startDate && endDate) {
        query.date = {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
        };
    } else {
        return next(new AppError('Please provide a specific date or a date range.', 400));
    }

    const schedule = await Appointment.find(query).populate('patient').select('date time status patient');

    res.status(200).json({
        status: 'success',
        data: { schedule }
    });
});

// POST /api/v1/doctors/me/slots
export const addSlot = catchAsync(async (req, res, next) => {
    const doctorId = req.user.id;
    const { date, time } = req.body;

    const newSlot = await Appointment.create({
        doctor: doctorId,
        date: new Date(date),
        time: time,
        status: 'available'
    });

    res.status(201).json({
        status: 'success',
        message: 'New slot added successfully.',
        data: { slot: newSlot }
    });
});

// Set up Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/credentials'); // This directory must exist
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
    },
});
const upload = multer({ storage: storage });
export const uploadCredentials = upload.single('credentials');