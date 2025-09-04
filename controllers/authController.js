import { promisify } from 'util';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

// The function that creates a new JWT for the user
const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });
};

export const requestOtp = async (req, res) => {
    const { mobile } = req.body;
    if (!mobile) {
        return res.status(400).json({ message: 'Mobile number is required.' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    try {
        let user = await User.findOne({ mobile });

        if (!user) {
            user = await User.create({ mobile, otp, otpExpires });
        } else {
            user.otp = otp;
            user.otpExpires = otpExpires;
            await user.save();
        }

        console.log(`OTP for ${mobile} is: ${otp}`);

        res.status(200).json({ message: 'OTP sent successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while requesting OTP.' });
    }
};

export const verifyOtp = async (req, res) => {
    const { mobile, otp } = req.body;
    if (!mobile || !otp) {
        return res.status(400).json({ message: 'Mobile number and OTP are required.' });
    }

    try {
        const user = await User.findOne({
            mobile,
            otp,
            otpExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid OTP or OTP has expired.' });
        }

        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        const token = signToken(user.id);

        res.status(200).json({
            token,
            user: {
                id: user.id,
                name: user.name,
                role: user.role
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during OTP verification.' });
    }
};

// Middleware to protect routes
export const protect = async (req, res, next) => {
    let token;
    // 1. Check if token exists in header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ message: 'You are not logged in! Please log in to get access.' });
    }

    try {
        // 2. Verify token
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

        // 3. Check if user still exists
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            return res.status(401).json({ message: 'The user belonging to this token no longer exists.' });
        }

        // 4. Grant access to protected route
        req.user = currentUser;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token.' });
    }
};

// Middleware to restrict access based on user role
export const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                status: 'fail',
                message: 'You do not have permission to perform this action.'
            });
        }
        next();
    };
};