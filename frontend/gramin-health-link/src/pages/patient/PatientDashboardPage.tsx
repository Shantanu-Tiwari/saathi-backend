import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmergencyButton } from '@/components/EmergencyButton';
import {
  Calendar,
  Clock,
  User,
  FileText,
  Stethoscope,
  Heart,
  LogOut,
  Bell,
} from 'lucide-react';

const PatientDashboardPage = () => {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth(); // Assuming useAuth provides the token
  const [currentUser, setCurrentUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (!token) {
          throw new Error('No authentication token available');
        }

        const headers = {
          'Authorization': `Bearer ${token}`,
        };

        console.log('Fetching dashboard data for user:', user?.id);

        // Fetch user data from the /me endpoint
        const userRes = await fetch(`${API_URL}/api/v1/users/me`, { headers });
        const userData = await userRes.json();
        
        console.log('User data response:', { status: userRes.status, data: userData });
        
        if (!userRes.ok) {
          if (userRes.status === 401) {
            // Token expired or invalid
            logout();
            navigate('/login');
            return;
          }
          throw new Error(userData.message || 'Failed to fetch user data.');
        }
        setCurrentUser(userData);

        // Fetch appointments from a hypothetical endpoint
        // You'll need to create this endpoint on your backend
        const appointmentsRes = await fetch(`${API_URL}/api/v1/appointments`, { headers });
        const appointmentsData = await appointmentsRes.json();
        
        console.log('Appointments response:', { status: appointmentsRes.status, data: appointmentsData });
        
        if (!appointmentsRes.ok) {
          if (appointmentsRes.status === 401) {
            // Token expired or invalid
            logout();
            navigate('/login');
            return;
          }
          throw new Error(appointmentsData.message || 'Failed to fetch appointments.');
        }
        setAppointments(appointmentsData.appointments || []);

      } catch (err) {
        console.error("Dashboard API Error:", err);
        setError(err.message);
        
        // If it's an authentication error, redirect to login
        if (err.message.includes('401') || err.message.includes('token')) {
          logout();
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch data if the user is authenticated and we have a token
    if (user && token) {
      fetchDashboardData();
    } else if (!user) {
      // User not authenticated, redirect to login
      navigate('/login');
    } else {
      setIsLoading(false);
    }
  }, [user, token, logout, navigate]);

  const quickActions = [
    {
      title: 'Book New Appointment',
      icon: Calendar,
      onClick: () => navigate('/patient/find-doctor'),
      color: 'bg-blue-500',
    },
    {
      title: 'My Appointments',
      icon: Clock,
      onClick: () => navigate('/patient/appointments'),
      color: 'bg-green-500',
    },
    {
      title: 'My Profile',
      icon: User,
      onClick: () => navigate('/patient/profile'),
      color: 'bg-purple-500',
    },
    {
      title: 'Medicines',
      icon: FileText,
      onClick: () => navigate('/patient/prescriptions'),
      color: 'bg-orange-500',
    },
  ];

  const healthTips = [
    'Drink 8-10 glasses of water daily',
    'Walk for 30 minutes daily',
    'Eat meals on time',
    'Get adequate sleep (7-8 hours)',
  ];

  if (isLoading) {
    return (
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
    );
  }

  if (error) {
    return (
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-red-500">Error: {error}</p>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome Back, {currentUser?.name || 'Patient'}!
              </h1>
              <p className="text-gray-600">Your Trusted Healthcare Companion</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Emergency Button */}
          <EmergencyButton className="mb-6" />

          {/* Upcoming Appointments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              {appointments.length > 0 ? (
                  <div className="space-y-3">
                    {appointments.map((appointment) => (
                        <div key={appointment._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="bg-primary/10 p-2 rounded-full">
                              <Stethoscope className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">Dr. {appointment.doctor.name}</p>
                              <p className="text-sm text-gray-600">{appointment.doctor.specialty}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{new Date(appointment.date).toLocaleDateString()}</p>
                            <p className="text-sm text-gray-600">{appointment.time}</p>
                            <Badge variant={appointment.status === 'confirmed' ? 'default' : 'secondary'}>
                              {appointment.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                            </Badge>
                          </div>
                        </div>
                    ))}
                  </div>
              ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No upcoming appointments</p>
                  </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                    <Button
                        key={index}
                        variant="outline"
                        className="h-20 flex-col gap-2 hover:bg-gray-50"
                        onClick={action.onClick}
                    >
                      <div className={`p-2 rounded-full ${action.color} text-white`}>
                        <action.icon className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-medium">{action.title}</span>
                    </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Health Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Health Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {healthTips.map((tip, index) => (
                    <div key={index} className="flex items-start gap-2 p-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <p className="text-sm text-gray-700">{tip}</p>
                    </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
  );
};

export default PatientDashboardPage;