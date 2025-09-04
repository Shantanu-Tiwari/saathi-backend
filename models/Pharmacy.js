import mongoose from 'mongoose';

const pharmacySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide the pharmacy name'],
    },
    address: {
        type: String,
        required: [true, 'Please provide the pharmacy address'],
    },
    pharmacist: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'A pharmacy must belong to a pharmacist'],
    },
    inventory: {
        type: Map,
        of: Boolean,
        default: {},
    },
    // New field to store prescriptions sent to this pharmacy
    prescriptionQueue: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Prescription',
    }],
}, {
    timestamps: true,
});

const Pharmacy = mongoose.model('Pharmacy', pharmacySchema);

export default Pharmacy;