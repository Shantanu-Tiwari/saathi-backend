import User from '../models/User.js';
import multer from 'multer';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

// Get a user's profile information
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while fetching user profile.' });
    }
};

// Update a user's profile information
export const updateMe = async (req, res) => {
    const { name, age, gender } = req.body;

    const fieldsToUpdate = {};
    if (name) fieldsToUpdate.name = name;
    if (age) fieldsToUpdate.age = age;
    if (gender) fieldsToUpdate.gender = gender;

    try {
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: fieldsToUpdate },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json({ message: 'Profile updated successfully.', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while updating profile.' });
    }
};

// --- New functionality for credential uploads ---

// Set up Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/credentials'); // This directory must exist
    },
    filename: (req, file, cb) => {
        // Create a unique filename with a timestamp
        const ext = file.mimetype.split('/')[1];
        cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
    },
});

const upload = multer({ storage: storage });

// Middleware to handle single file upload
export const uploadCredentials = upload.single('credentials');

// The main controller function to update the user's credentials
export const submitCredentials = catchAsync(async (req, res, next) => {
    // Check if the user is a doctor
    if (req.user.role !== 'doctor') {
        return next(new AppError('Only doctors can submit credentials.', 403));
    }

    // Check if a file was uploaded
    if (!req.file) {
        return next(new AppError('Please upload a credentials file.', 400));
    }

    // Update the user's document with the path to the uploaded file
    const user = await User.findByIdAndUpdate(
        req.user.id,
        { credentials: req.file.path, verificationStatus: 'pending' },
        { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
        status: 'success',
        message: 'Credentials submitted for verification.',
        data: {
            user,
        },
    });
});