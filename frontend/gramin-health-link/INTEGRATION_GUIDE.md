# Sehat Saathi Frontend-Backend Integration Guide

## Overview
This guide documents the complete integration between the Sehat Saathi frontend (React + TypeScript) and backend (Node.js + Express) applications.

## Backend API Endpoints

### Authentication
- `POST /api/v1/auth/request-otp` - Request OTP for phone number
- `POST /api/v1/auth/verify-otp` - Verify OTP and get JWT token

### User Management
- `GET /api/v1/users/me` - Get current user profile
- `PATCH /api/v1/users/me` - Update user profile
- `POST /api/v1/users/submit-credentials` - Submit doctor credentials (form-data)

### Doctors
- `GET /api/v1/doctors` - Get all doctors (public)
- `GET /api/v1/doctors/:id` - Get doctor details (public)
- `GET /api/v1/doctors/me/schedule` - Get doctor's schedule (protected)
- `POST /api/v1/doctors/me/slots` - Add new time slot (doctor only)

### Appointments
- `POST /api/v1/appointments` - Book new appointment
- `GET /api/v1/appointments` - Get user's appointments

### Health Records
- `POST /api/v1/healthrecords` - Create health record (doctor only)
- `GET /api/v1/healthrecords` - Get health records
- `GET /api/v1/healthrecords/:id` - Get specific health record

### Prescriptions
- `POST /api/v1/prescriptions` - Create prescription (doctor only)
- `GET /api/v1/prescriptions` - Get prescriptions

### Pharmacy
- `GET /api/v1/pharmacies` - Get all pharmacies (public)
- `GET /api/v1/pharmacies/:id` - Get pharmacy details
- `PATCH /api/v1/pharmacies/update-inventory` - Update inventory (pharmacist only)
- `GET /api/v1/pharmacies/prescription-queue` - Get prescription queue (pharmacist only)

## Frontend Architecture

### API Client (`src/services/api.ts`)
Centralized API client that handles:
- Base URL configuration from environment variables
- JWT token management
- Request/response formatting
- Error handling

### Custom Hooks
All hooks use React Query for state management and caching:

#### Authentication (`src/hooks/useAuth.ts`)
- `requestOTP(mobile)` - Request OTP
- `verifyOTP(mobile, otp)` - Verify OTP and login
- `logout()` - Clear authentication state

#### Doctors (`src/hooks/useDoctors.ts`)
- `useDoctors()` - Fetch all doctors
- `useDoctorDetails(id)` - Fetch specific doctor
- `useDoctorSchedule()` - Fetch doctor's schedule
- `useAddSlot()` - Add new time slot

#### Appointments (`src/hooks/useAppointments.ts`)
- `useAppointments()` - Fetch user appointments
- `useBookAppointment()` - Book new appointment

#### Health Records (`src/hooks/useHealthRecords.ts`)
- `useHealthRecords()` - Fetch health records
- `useHealthRecord(id)` - Fetch specific record
- `useCreateHealthRecord()` - Create new record

#### Prescriptions (`src/hooks/usePrescriptions.ts`)
- `usePrescriptions()` - Fetch prescriptions
- `useCreatePrescription()` - Create new prescription

#### Pharmacy (`src/hooks/usePharmacy.ts`)
- `usePharmacies()` - Fetch all pharmacies
- `usePharmacy(id)` - Fetch specific pharmacy
- `useUpdateInventory()` - Update pharmacy inventory
- `usePrescriptionQueue()` - Fetch prescription queue

#### User Management (`src/hooks/useUser.ts`)
- `useUserProfile()` - Fetch user profile
- `useUpdateUserProfile()` - Update profile
- `useSubmitCredentials()` - Submit doctor credentials

## Environment Configuration

### Backend URL Setup
Create `.env` file in frontend root:
```env
# Production
VITE_API_URL=https://your-backend-url.herokuapp.com/api/v1

# Development
# VITE_API_URL=http://localhost:5000/api/v1
```

## Updated Pages

### Authentication Flow
- **LoginPage**: Uses `useAuth.requestOTP()` for OTP requests
- **OtpVerificationPage**: Uses `useAuth.verifyOTP()` for verification

### Patient Pages
- **FindDoctorPage**: Uses `useDoctors()` hook for doctor listing
- **BookAppointmentPage**: Uses `useDoctorDetails()` and `useBookAppointment()`
- **AppointmentsHistoryPage**: Uses `useAppointments()` for appointment history
- **PatientProfilePage**: Uses `useUserProfile()` and `useUpdateUserProfile()`

### Doctor Pages
- **DoctorDashboardPage**: Ready for `useDoctorSchedule()` integration
- **DoctorSchedulePage**: Ready for `useAddSlot()` integration

## Key Features Implemented

### 1. Centralized API Client
- Automatic token management
- Consistent error handling
- Environment-based URL configuration

### 2. React Query Integration
- Automatic caching and background updates
- Loading and error states
- Optimistic updates for mutations

### 3. Type Safety
- TypeScript interfaces for all API responses
- Proper error handling with typed errors

### 4. Authentication Flow
- JWT token storage and management
- Automatic token refresh handling
- Protected route implementation

## Usage Examples

### Booking an Appointment
```typescript
const { mutate: bookAppointment } = useBookAppointment();

bookAppointment({
  doctorId: 'doctor123',
  date: '2024-01-15T10:00:00Z',
  time: '10:00',
  symptoms: 'Fever and headache'
});
```

### Fetching User Profile
```typescript
const { data: profile, isLoading, error } = useUserProfile();

if (isLoading) return <div>Loading...</div>;
if (error) return <div>Error: {error.message}</div>;

return <div>Welcome, {profile.name}!</div>;
```

### Updating Profile
```typescript
const updateProfile = useUpdateUserProfile();

updateProfile.mutate({
  name: 'New Name',
  email: 'new@email.com'
}, {
  onSuccess: () => {
    toast.success('Profile updated!');
  }
});
```

## Error Handling

All API calls include comprehensive error handling:
- Network errors
- Authentication errors
- Validation errors
- Server errors

Errors are automatically displayed via toast notifications using Sonner.

## Testing the Integration

1. **Start Backend**: Ensure your backend server is running
2. **Update Environment**: Set correct `VITE_API_URL` in `.env`
3. **Test Authentication**: Try login with OTP flow
4. **Test Features**: Navigate through different pages and test API calls

## Troubleshooting

### Common Issues
1. **CORS Errors**: Ensure backend has proper CORS configuration
2. **Token Issues**: Check JWT token format and expiration
3. **API URL**: Verify environment variable is correctly set
4. **Network Errors**: Check backend server status and URL

### Debug Mode
Enable debug logging by checking browser console for API calls and responses.

## Next Steps

1. **Add Real Data**: Replace mock data with actual API responses
2. **Error Boundaries**: Implement React error boundaries
3. **Offline Support**: Add service worker for offline functionality
4. **Performance**: Implement lazy loading and code splitting
5. **Testing**: Add unit and integration tests

## Security Considerations

- JWT tokens are stored in localStorage (consider httpOnly cookies for production)
- All API calls include proper authentication headers
- Input validation on both frontend and backend
- CORS configuration for cross-origin requests

This integration provides a solid foundation for the Sehat Saathi healthcare platform with proper separation of concerns, type safety, and maintainable code structure.
