import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js';

// Import route files
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import doctorRoutes from './routes/doctors.js';
import appointmentRoutes from './routes/appointments.js';
import prescriptionRoutes from './routes/prescription.js'; // New line
import pharmacyRoutes from "./routes/pharmacyRoutes.js";
import healthRecordRoutes from "./routes/healthRecordRoutes.js";
import {scheduleAppointmentAlerts} from "./controllers/alertController.js";
// Initialize Express app
const app = express();

// Connect to the database
connectDB();

// Middleware setup
app.use(cors());
app.use(express.json());

// Define API routes
app.get('/', (req, res) => {
    res.send('Sehat Saathi API is running...');
});

scheduleAppointmentAlerts();

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/doctors', doctorRoutes);
app.use('/api/v1/appointments', appointmentRoutes);
app.use('/api/v1/prescriptions', prescriptionRoutes);
app.use('/api/v1/pharmacies', pharmacyRoutes);
app.use('/api/v1/healthrecords', healthRecordRoutes);


// Define the port and start the server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
