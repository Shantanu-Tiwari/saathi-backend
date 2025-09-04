// controllers/alertController.js

import cron from 'node-cron';
import Appointment from '../models/Appointment.js';
import User from '../models/User.js';

// The function to send the alert
const sendAppointmentAlert = async () => {
    try {
        const now = new Date();
        // Find appointments scheduled for 10 minutes from now
        const upcomingAppointments = await Appointment.find({
            time: { $gte: now, $lte: new Date(now.getTime() + 10 * 60 * 1000) },
        }).populate('doctor', 'name email'); // Populate the doctor's info

        upcomingAppointments.forEach(async (appointment) => {
            if (appointment.doctor) {
                console.log(`Alert: Doctor ${appointment.doctor.name} has an appointment in 10 minutes.`);
            }
        });

    } catch (error) {
        console.error('Error sending appointment alerts:', error);
    }
};

// Function to schedule the job
export const scheduleAppointmentAlerts = () => {
    // This cron expression runs the job every minute
    cron.schedule('* * * * *', () => {
        console.log('Running scheduled job to check for upcoming appointments...');
        sendAppointmentAlert();
    });
};