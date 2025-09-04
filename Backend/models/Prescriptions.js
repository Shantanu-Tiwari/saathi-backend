import mongoose from 'mongoose';
const { Schema } = mongoose;

const PrescriptionSchema = new Schema({
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
    appointment: {
        type: Schema.Types.ObjectId,
        ref: 'Appointment',
        required: true,
        unique: true // An appointment should only have one prescription
    },
    medicines: [{
        type: String,
        required: true
    }],
    notes: {
        type: String
    }
}, { timestamps: true }); // Adds createdAt and updatedAt timestamps

const Prescription = mongoose.model('Prescription', PrescriptionSchema);

export default Prescription;