# Development Guide

This guide explains how to view all pages without backend logic for development and testing purposes.

## Viewing Pages Without Backend

The application includes a development mode that allows you to view all doctor and patient pages without setting up backend logic. This is achieved through:

1. Mock authentication in development mode
2. Role switching component for easy testing
3. Bypassed authentication checks for protected routes

## How to Use

1. Start the development server:
   ```
   npm run dev
   ```

2. The application will automatically log you in as a mock doctor user in development mode.

3. Use the Role Switcher (top-right corner) to switch between Doctor and Patient views:
   - Click "Doctor" to view doctor pages
   - Click "Patient" to view patient pages

## Available Pages

### Doctor Pages
- `/doctor/dashboard` - Doctor Dashboard
- `/doctor/schedule` - Doctor Schedule

### Patient Pages
- `/patient/dashboard` - Patient Dashboard
- `/patient/find-doctor` - Find Doctor
- `/patient/book-appointment` - Book Appointment
- `/patient/appointments` - Appointments History
- `/patient/profile` - Patient Profile

### Public Pages
- `/` - Landing Page
- `/login` - Login Page
- `/otp-verification` - OTP Verification Page

## How It Works

1. The `useAuth` hook provides mock authentication in development mode
2. The Role Switcher component allows switching between doctor and patient roles
3. Route protection is bypassed in development mode
4. All pages use mock data instead of real API calls

## Making Changes

When you're ready to implement real backend logic:
1. Remove or modify the development mode checks in `useAuth.ts`
2. Update the route protection logic in `App.tsx`
3. Replace mock data with real API calls
4. Remove the Role Switcher component if no longer needed