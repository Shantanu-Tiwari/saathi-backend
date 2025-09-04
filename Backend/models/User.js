import mongoose from 'mongoose';
const { Schema } = mongoose;

const UserSchema = new Schema({
    name: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true
    },
    mobile: {
        type: String,
        trim: true
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    role: {
        type: String,
        enum: ['patient', 'doctor', 'pharmacist'],
        default: 'patient'
    },
    credentials: {
        type: String,
    },
    verificationStatus: {
        type: String,
        enum: ['pending', 'verified', 'rejected']
    },
    otp: {
        type: String
    },
    otpExpires: {
        type: Date
    },
    profile: {
        age: { type: Number },
        gender: { type: String, enum: ['Male', 'Female', 'Other'] },
        specialty: { type: String }, // Primarily for doctors
        avatar: { type: String } // Profile picture URL
    }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

export default User;