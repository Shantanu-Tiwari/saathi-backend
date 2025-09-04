import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Stethoscope,
  FileText,
  Phone,
  MapPin
} from 'lucide-react';

const AppointmentsHistoryPage = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(`${API_URL}/api/v1/appointments/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch appointments.');
        }

        const now = new Date();
        const upcoming = [];
        const past = [];

        data.appointments.forEach(app => {
          const appDate = new Date(app.date);
          if (appDate >= now) {
            upcoming.push(app);
          } else {
            past.push(app);
          }
        });

        setUpcomingAppointments(upcoming);
        setPastAppointments(past);

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
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800">Confirmed</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const AppointmentCard = ({ appointment, showActions = true }) => (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Stethoscope className="h-6 w-6 text-primary" />
              </div>

              <div className="space-y-2">
                <div>
                  <h3 className="text-lg font-semibold">{appointment.doctor.name}</h3>
                  <p className="text-gray-600">{appointment.doctor.specialty}</p>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(appointment.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{appointment.time}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{appointment.doctor.location}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {getStatusBadge(appointment.status)}
                  <span className="text-sm text-gray-600">
                  Fee: ₹{appointment.consultationFee}
                </span>
                </div>

                {appointment.symptoms && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Reason:</span> {appointment.symptoms}
                    </p>
                )}
              </div>
            </div>

            {showActions && (
                <div className="flex flex-col gap-2">
                  {appointment.status === 'confirmed' && (
                      <>
                        <Button size="sm" variant="outline">
                          <Phone className="h-4 w-4 mr-1" />
                          Call
                        </Button>
                        <Button size="sm" variant="outline">
                          Reschedule
                        </Button>
                      </>
                  )}

                  {appointment.status === 'pending' && (
                      <Button size="sm" variant="outline">
                        Cancel
                      </Button>
                  )}

                  {appointment.status === 'completed' && appointment.prescription && (
                      <Button size="sm" variant="outline">
                        <FileText className="h-4 w-4 mr-1" />
                        Prescription
                      </Button>
                  )}

                  <Button size="sm" variant="ghost">
                    Details
                  </Button>
                </div>
            )}
          </div>
        </CardContent>
      </Card>
  );

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading appointments...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">Error: {error}</div>;
  }

  return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/patient/dashboard')}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">
                My Appointments
              </h1>
            </div>

            <Button onClick={() => navigate('/patient/find-doctor')}>
              Book New Appointment
            </Button>
          </div>

          {/* Appointments Tabs */}
          <Tabs defaultValue="upcoming" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upcoming" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Upcoming ({upcomingAppointments.length})
              </TabsTrigger>
              <TabsTrigger value="past" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Past ({pastAppointments.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-4">
              {upcomingAppointments.length > 0 ? (
                  upcomingAppointments.map((appointment) => (
                      <AppointmentCard key={appointment._id} appointment={appointment} />
                  ))
              ) : (
                  <Card>
                    <CardContent className="text-center py-12">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No upcoming appointments</p>
                      <p className="text-sm text-gray-500 mt-1">Book your first appointment</p>
                      <Button
                          className="mt-4"
                          onClick={() => navigate('/patient/find-doctor')}
                      >
                        Find Doctor
                      </Button>
                    </CardContent>
                  </Card>
              )}
            </TabsContent>

            <TabsContent value="past" className="space-y-4">
              {pastAppointments.length > 0 ? (
                  pastAppointments.map((appointment) => (
                      <AppointmentCard
                          key={appointment._id}
                          appointment={appointment}
                          showActions={appointment.status === 'completed'}
                      />
                  ))
              ) : (
                  <Card>
                    <CardContent className="text-center py-12">
                      <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No past appointments</p>
                      <p className="text-sm text-gray-500 mt-1">Your appointment history will appear here</p>
                    </CardContent>
                  </Card>
              )}
            </TabsContent>
          </Tabs>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {upcomingAppointments.length}
                </div>
                <div className="text-sm text-gray-600">Upcoming</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {pastAppointments.filter(a => a.status === 'completed').length}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">
                  {pastAppointments.filter(a => a.status === 'cancelled').length}
                </div>
                <div className="text-sm text-gray-600">Cancelled</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {upcomingAppointments.length + pastAppointments.length}
                </div>
                <div className="text-sm text-gray-600">Total</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  );
};

export default AppointmentsHistoryPage;