import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Calendar,
  Clock,
  User,
  Phone,
  Video,
  FileText,
  Bell,
  LogOut,
  Stethoscope,
  Users
} from 'lucide-react';

const DoctorDashboardPage = () => {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();

  const [todaysAppointments, setTodaysAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const today = new Date();
        const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
        const endOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 6);

        const response = await fetch(
            `${API_URL}/api/v1/doctors/me/schedule?startDate=${startOfWeek.toISOString()}&endDate=${endOfWeek.toISOString()}`,
            { headers: { 'Authorization': `Bearer ${token}` } }
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch appointments.');
        }

        const allAppointments = data.data.schedule;
        const todayString = today.toISOString().split('T')[0];

        const todayList = allAppointments.filter(app => {
          return new Date(app.date).toISOString().split('T')[0] === todayString && app.status !== 'available';
        });

        const upcomingList = allAppointments.filter(app => {
          const appDateString = new Date(app.date).toISOString().split('T')[0];
          return appDateString > todayString && app.status !== 'available';
        });

        setTodaysAppointments(todayList);
        setUpcomingAppointments(upcomingList);
      } catch (err) {
        console.error("API Error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchAppointments();
    }
  }, [token]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'waiting':
        return <Badge className="bg-yellow-100 text-yellow-800">Waiting</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case 'scheduled':
        return <Badge className="bg-green-100 text-green-800">Scheduled</Badge>;
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800">Scheduled</Badge>;
      case 'completed':
        return <Badge className="bg-gray-100 text-gray-800">Completed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'consultation':
        return <Stethoscope className="h-4 w-4" />;
      case 'follow-up':
        return <FileText className="h-4 w-4" />;
      case 'checkup':
        return <User className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const handleStartConsultation = (appointmentId) => {
    console.log('Starting consultation for:', appointmentId);
  };

  const handleViewDetails = (appointmentId) => {
    console.log('Viewing details for:', appointmentId);
  };

  if (isLoading) {
    return (
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
    );
  }

  if (error) {
    return (
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-red-500">Error: {error}</p>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome Back, Dr. {user?.name || 'Doctor'}!
              </h1>
              <p className="text-gray-600">You have {todaysAppointments.length} appointments today</p>
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

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{todaysAppointments.length}</p>
                    <p className="text-sm text-gray-600">Today's Appointments</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-yellow-100 p-2 rounded-full">
                    <Clock className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{todaysAppointments.filter(a => a.status === 'waiting').length}</p>
                    <p className="text-sm text-gray-600">Waiting</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{todaysAppointments.filter(a => a.status === 'completed').length}</p>
                    <p className="text-sm text-gray-600">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <Calendar className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{upcomingAppointments.length}</p>
                    <p className="text-sm text-gray-600">Upcoming</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Appointments Tabs */}
          <Tabs defaultValue="today" className="space-y-4">
            <TabsList>
              <TabsTrigger value="today" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Today's Appointments
              </TabsTrigger>
              <TabsTrigger value="upcoming" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Upcoming
              </TabsTrigger>
            </TabsList>

            <TabsContent value="today" className="space-y-4">
              {todaysAppointments.length > 0 ? (
                  todaysAppointments.map((appointment) => (
                      <Card key={appointment._id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="bg-primary/10 p-3 rounded-full">
                                <User className="h-6 w-6 text-primary" />
                              </div>

                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold">{appointment.patient.name}</h3>
                                  <span className="text-sm text-gray-500">({appointment.patient.age} years)</span>
                                  {getTypeIcon(appointment.type)}
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    <span>{appointment.time}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Phone className="h-4 w-4" />
                                    <span>{appointment.patient.phone}</span>
                                  </div>
                                </div>
                                {appointment.symptoms && (
                                    <p className="text-sm text-gray-600">
                                      <span className="font-medium">Symptoms:</span> {appointment.symptoms}
                                    </p>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              {getStatusBadge(appointment.status)}

                              <div className="flex gap-2">
                                {appointment.status === 'waiting' && (
                                    <Button
                                        size="sm"
                                        onClick={() => handleStartConsultation(appointment._id)}
                                    >
                                      <Video className="h-4 w-4 mr-1" />
                                      Start
                                    </Button>
                                )}

                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleViewDetails(appointment._id)}
                                >
                                  <FileText className="h-4 w-4 mr-1" />
                                  Details
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                  ))
              ) : (
                  <Card>
                    <CardContent className="text-center py-8">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No appointments for today.</p>
                    </CardContent>
                  </Card>
              )}
            </TabsContent>

            <TabsContent value="upcoming" className="space-y-4">
              {upcomingAppointments.length > 0 ? (
                  upcomingAppointments.map((appointment) => (
                      <Card key={appointment._id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="bg-primary/10 p-3 rounded-full">
                                <User className="h-6 w-6 text-primary" />
                              </div>

                              <div className="space-y-1">
                                <h3 className="font-semibold">{appointment.patient.name}</h3>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    <span>{new Date(appointment.date).toLocaleDateString()}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    <span>{appointment.time}</span>
                                  </div>
                                  {getTypeIcon(appointment.type)}
                                </div>
                              </div>
                            </div>

                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewDetails(appointment._id)}
                            >
                              <FileText className="h-4 w-4 mr-1" />
                              Details
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                  ))
              ) : (
                  <Card>
                    <CardContent className="text-center py-8">
                      <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No upcoming appointments this week.</p>
                    </CardContent>
                  </Card>
              )}
            </TabsContent>
          </Tabs>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button
                    variant="outline"
                    className="h-16 flex-col gap-2"
                    onClick={() => navigate('/doctor/schedule')}
                >
                  <Calendar className="h-5 w-5" />
                  <span className="text-sm">My Schedule</span>
                </Button>

                <Button
                    variant="outline"
                    className="h-16 flex-col gap-2"
                >
                  <Users className="h-5 w-5" />
                  <span className="text-sm">Patient List</span>
                </Button>

                <Button
                    variant="outline"
                    className="h-16 flex-col gap-2"
                >
                  <FileText className="h-5 w-5" />
                  <span className="text-sm">Reports</span>
                </Button>

                <Button
                    variant="outline"
                    className="h-16 flex-col gap-2"
                >
                  <Bell className="h-5 w-5" />
                  <span className="text-sm">Alerts</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
  );
};

export default DoctorDashboardPage;