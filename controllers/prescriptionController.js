import Prescription from '../models/Prescription.js';
import Appointment from '../models/Appointment.js';

export const createPrescription = async (req, res) => {
    const { appointmentId, medicines, notes } = req.body;

    if (req.user.role !== 'doctor') {
        return res.status(403).json({ message: 'Forbidden: Only doctors can create prescriptions.' });
    }

    try {
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found.' });
        }

        // Ensure the doctor creating the prescription is the one assigned to the appointment
        if (appointment.doctor.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Forbidden: You are not the doctor for this appointment.' });
        }

        const existingPrescription = await Prescription.findOne({ appointment: appointmentId });
        if (existingPrescription) {
            return res.status(409).json({ message: 'A prescription for this appointment already exists.' });
        }

        const newPrescription = new Prescription({
            doctor: req.user.id,
            patient: appointment.patient,
            appointment: appointmentId,
            medicines,
            notes
        });

        const prescription = await newPrescription.save();
        res.status(201).json(prescription);
    } catch (err) {
        console.error(err.message);
        if (err.code === 11000) {
            return res.status(409).json({ message: 'A prescription for this appointment already exists.' });
        }
        res.status(500).send('Server Error');
    }
};

export const getPrescriptions = async (req, res) => {
    try {
        const query = (req.user.role === 'doctor')
            ? { doctor: req.user.id }
            : { patient: req.user.id };

        const prescriptions = await Prescription.find(query)
            .populate('doctor', 'name')
            .populate('patient', 'name')
            .populate('appointment', 'slot');

        res.json(prescriptions);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
