import mongoose from 'mongoose';
const { Schema } = mongoose;

const AppointmentSchema = new Schema({
    patient: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    doctor: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    slot: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['booked', 'completed', 'cancelled'],
        default: 'booked'
    },
    notes: {
        type: String
    }
}, { timestamps: true });

// Add a compound index to ensure a doctor can only have one appointment per slot
AppointmentSchema.index({ doctor: 1, slot: 1 }, { unique: true });

const Appointment = mongoose.model('Appointment', AppointmentSchema);

export default Appointment;
