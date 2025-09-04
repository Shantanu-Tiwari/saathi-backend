import mongoose from 'mongoose';

const healthRecordSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'A health record must belong to a patient'],
    },
    doctor: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'A health record must be created by a doctor'],
    },
    appointment: {
        type: mongoose.Schema.ObjectId,
        ref: 'Appointment',
        required: [true, 'A health record must be linked to an appointment'],
    },
    diagnosis: {
        type: String,
        required: [true, 'A diagnosis is required for the health record'],
    },
    notes: {
        type: String,
        required: [true, 'Consultation notes are required'],
    },
    symptoms: [String],
    treatmentPlan: String,
    medications: [String],
    attachments: [String], // Array of URLs to uploaded documents, reports, etc.
}, {
    timestamps: true,
});

const HealthRecord = mongoose.model('HealthRecord', healthRecordSchema);

export default HealthRecord;