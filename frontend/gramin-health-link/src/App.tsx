import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import LandingPage from "./pages/public/LandingPage";
import LoginPage from "./pages/public/LoginPage";
import OtpVerificationPage from "./pages/public/OtpVerificationPage";
import GoogleAuthCallback from "./pages/public/GoogleAuthCallback";
import PatientDashboardPage from "./pages/patient/PatientDashboardPage";
import FindDoctorPage from "./pages/patient/FindDoctorPage";
import BookAppointmentPage from "./pages/patient/BookAppointmentPage";
import AppointmentsHistoryPage from "./pages/patient/AppointmentsHistoryPage";
import PatientProfilePage from "./pages/patient/PatientProfilePage";
import DoctorDashboardPage from "./pages/doctor/DoctorDashboardPage";
import DoctorSchedulePage from "./pages/doctor/DoctorSchedulePage";
import NotFound from "./pages/NotFound";
import "./lib/i18n";

const App = () => {
  const { isAuthenticated, isLoading, user } = useAuth();

  // This is a crucial check to prevent rendering before auth state is determined
  if (isLoading) {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
            <span className="text-lg text-muted-foreground">Loading Sehat Saathi...</span>
          </div>
        </div>
    );
  }

  return (
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={isAuthenticated && user ? <Navigate to={user.role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard'} replace /> : <LandingPage />} />
          <Route path="/login" element={isAuthenticated && user ? <Navigate to={user.role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard'} replace /> : <LoginPage />} />
          <Route path="/otp-verification" element={isAuthenticated && user ? <Navigate to={user.role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard'} replace /> : <OtpVerificationPage />} />
          <Route path="/auth/callback" element={<GoogleAuthCallback />} />

          {/* Protected Patient Routes */}
          <Route path="/patient/dashboard" element={<ProtectedRoute allowedRoles={['patient']}><PatientDashboardPage /></ProtectedRoute>} />
          <Route path="/patient/find-doctor" element={<ProtectedRoute allowedRoles={['patient']}><FindDoctorPage /></ProtectedRoute>} />
          <Route path="/patient/book-appointment" element={<ProtectedRoute allowedRoles={['patient']}><BookAppointmentPage /></ProtectedRoute>} />
          <Route path="/patient/appointments" element={<ProtectedRoute allowedRoles={['patient']}><AppointmentsHistoryPage /></ProtectedRoute>} />
          <Route path="/patient/profile" element={<ProtectedRoute allowedRoles={['patient']}><PatientProfilePage /></ProtectedRoute>} />

          {/* Protected Doctor Routes */}
          <Route path="/doctor/dashboard" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorDashboardPage /></ProtectedRoute>} />
          <Route path="/doctor/schedule" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorSchedulePage /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
  );
};

export default App;
