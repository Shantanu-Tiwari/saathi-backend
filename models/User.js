import mongoose from 'mongoose';
const { Schema } = mongoose;

const UserSchema = new Schema({
    name: {
        type: String,
        trim: true
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
        trim: true
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
        specialty: { type: String } // Primarily for doctors
    }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

export default User;