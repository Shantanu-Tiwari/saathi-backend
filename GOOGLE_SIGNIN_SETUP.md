# Google Sign-In Setup Guide

This guide will help you set up Google Sign-In for the Sehat Saathi application.

## Prerequisites

1. A Google Cloud Console account
2. Node.js and npm installed
3. MongoDB running locally or connection string ready

## Step 1: Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized JavaScript origins:
     - `http://localhost:3000` (for development)
     - Your production frontend URL
   - Add authorized redirect URIs:
     - `http://localhost:5000/api/v1/auth/google/callback` (for development)
     - Your production backend callback URL
   - Save and copy the Client ID and Client Secret

## Step 2: Backend Configuration

1. Install the new dependency:
   ```bash
   cd Backend
   npm install google-auth-library
   ```

2. Update your `.env` file with Google credentials:
   ```env
   GOOGLE_CLIENT_ID=your-actual-google-client-id
   GOOGLE_CLIENT_SECRET=your-actual-google-client-secret
   GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback
   FRONTEND_URL=http://localhost:3000
   ```

## Step 3: Frontend Configuration

1. Update your `.env` file in the frontend:
   ```env
   VITE_GOOGLE_CLIENT_ID=your-actual-google-client-id
   VITE_API_URL=http://localhost:5000/api/v1
   ```

## Step 4: Start the Application

1. Start the backend:
   ```bash
   cd Backend
   npm start
   ```

2. Start the frontend:
   ```bash
   cd frontend/gramin-health-link
   npm run dev
   ```

## Features Implemented

### Backend Features:
- **OAuth2 Flow**: Traditional redirect-based Google authentication
- **JWT Credential Verification**: For Google Sign-In button integration
- **User Management**: Automatic user creation and linking for Google accounts
- **Session Management**: Secure JWT token generation
- **Role-based Access**: Default role assignment for new Google users

### Frontend Features:
- **Google Sign-In Button**: One-click authentication using Google's official button
- **OAuth2 Redirect Flow**: Alternative authentication method
- **Automatic Redirection**: Role-based dashboard redirection
- **Error Handling**: Comprehensive error handling and user feedback
- **Loading States**: Visual feedback during authentication process

## API Endpoints

### Google Authentication Endpoints:
- `GET /api/v1/auth/google` - Initiate OAuth2 flow
- `GET /api/v1/auth/google/callback` - OAuth2 callback handler
- `POST /api/v1/auth/google/verify` - Verify Google JWT credential

### User Management Endpoints:
- `GET /api/v1/auth/me` - Get current user profile
- `PATCH /api/v1/auth/me` - Update user profile

## Security Features

1. **JWT Token Validation**: Secure token-based authentication
2. **Google Credential Verification**: Server-side verification of Google tokens
3. **CORS Configuration**: Proper cross-origin resource sharing setup
4. **Environment Variables**: Sensitive data stored in environment variables
5. **Role-based Access Control**: User role verification for protected routes

## Troubleshooting

### Common Issues:

1. **"Invalid Google Client ID"**:
   - Verify the client ID in both frontend and backend .env files
   - Ensure the client ID matches the one from Google Cloud Console

2. **"Redirect URI Mismatch"**:
   - Check that the redirect URIs in Google Cloud Console match your backend URL
   - Ensure the callback URL is correctly configured

3. **"CORS Error"**:
   - Verify the frontend URL is correctly set in the backend CORS configuration
   - Check that FRONTEND_URL environment variable is set correctly

4. **"User Creation Failed"**:
   - Ensure MongoDB is running and accessible
   - Check database connection string in .env file

### Testing the Implementation:

1. **Google Sign-In Button**:
   - Click the Google Sign-In button on the login page
   - Should redirect to Google authentication
   - After successful authentication, should redirect to appropriate dashboard

2. **OAuth2 Flow**:
   - Navigate to `http://localhost:5000/api/v1/auth/google`
   - Should redirect to Google authentication
   - After authentication, should redirect back to frontend with token

3. **User Profile**:
   - After successful login, user profile should be accessible
   - Avatar and email should be populated from Google account

## Production Deployment

For production deployment:

1. Update Google Cloud Console with production URLs
2. Set production environment variables
3. Use HTTPS for all URLs
4. Configure proper CORS settings
5. Set secure session cookies
6. Use strong JWT secrets

## Support

If you encounter any issues:
1. Check the browser console for error messages
2. Check the backend server logs
3. Verify all environment variables are set correctly
4. Ensure Google Cloud Console configuration matches your setup