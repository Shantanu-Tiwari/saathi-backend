import Appointment from '../models/Appointment.js';
import User from '../models/User.js';

export const bookAppointment = async (req, res) => {
    const { doctorId, slot } = req.body;
    try {
        const doctor = await User.findById(doctorId);
        if (!doctor || doctor.role !== 'doctor') {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        const existingAppointment = await Appointment.findOne({ doctor: doctorId, slot });
        if (existingAppointment) {
            return res.status(409).json({ message: 'This time slot is already booked. Please choose another time.' });
        }

        const newAppointment = new Appointment({
            patient: req.user.id,
            doctor: doctorId,
            slot,
        });

        const appointment = await newAppointment.save();
        res.status(201).json(appointment);
    } catch (err) {
        console.error(err.message);
        if (err.code === 11000) {
            return res.status(409).json({ message: 'This time slot was just booked. Please choose another time.' });
        }
        res.status(500).send('Server Error');
    }
};

export const getAppointments = async (req, res) => {
    try {
        const query = (req.user.role === 'doctor')
            ? { doctor: req.user.id }
            : { patient: req.user.id };

        const appointments = await Appointment.find(query)
            .populate('doctor', 'name')
            .populate('patient', 'name');

        res.json(appointments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
