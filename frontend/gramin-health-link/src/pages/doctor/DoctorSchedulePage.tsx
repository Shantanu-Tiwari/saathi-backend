import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Clock,
  User,
  ChevronLeft,
  ChevronRight,
  Plus
} from 'lucide-react';

const DoctorSchedulePage = () => {
  const navigate = useNavigate();
  const { token, user } = useAuth(); // Assuming useAuth provides the token
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentWeek, setCurrentWeek] = useState(new Date());

  const [schedule, setSchedule] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Utility function to get the start and end of the current week
  const getWeekRange = (date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
    startOfWeek.setDate(diff);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return { startOfWeek, endOfWeek };
  };

  // --- 1. Fetch the weekly schedule from the backend ---
  useEffect(() => {
    const fetchSchedule = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { startOfWeek, endOfWeek } = getWeekRange(currentWeek);
        const startDate = startOfWeek.toISOString().split('T')[0];
        const endDate = endOfWeek.toISOString().split('T')[0];

        const response = await fetch(`${API_URL}/api/v1/doctors/me/schedule?startDate=${startDate}&endDate=${endDate}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch schedule.');
        }

        // Process fetched data to group by day
        const groupedSchedule = {};
        dayNames.forEach(day => groupedSchedule[day] = []);
        data.data.schedule.forEach(slot => {
          const dayName = new Date(slot.date).toLocaleDateString('en-US', { weekday: 'long' });
          groupedSchedule[dayName].push(slot);
        });

        setSchedule(groupedSchedule);
      } catch (err) {
        console.error("API Error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (token && user?.role === 'doctor') {
      fetchSchedule();
    }
  }, [currentWeek, token, user]);

  const getStatusBadge = (status, patient) => {
    if (!patient) {
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Available</Badge>;
    }

    switch (status) {
      case 'confirmed':
        return <Badge className="bg-blue-100 text-blue-800">Confirmed</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'border-l-blue-500';
      case 'pending':
        return 'border-l-orange-500';
      case 'available':
        return 'border-l-green-500';
      default:
        return 'border-l-gray-300';
    }
  };

  const TimeSlot = ({ slot }) => (
      <div className={`p-3 border-l-4 ${getTypeColor(slot.status)} bg-white rounded-r-lg shadow-sm hover:shadow-md transition-shadow`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-sm font-medium text-gray-900">{slot.time}</div>
            {slot.patient ? (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{slot.patient.name}</span>
                </div>
            ) : (
                <div className="flex items-center gap-2">
                  <Plus className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-500">Free Slot</span>
                </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(slot.status, slot.patient)}
            {slot.patient && (
                <Button size="sm" variant="ghost">
                  Details
                </Button>
            )}
          </div>
        </div>
      </div>
  );

  const handlePreviousWeek = () => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeek(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeek(newDate);
  };

  const getWeekDates = () => {
    const { startOfWeek, endOfWeek } = getWeekRange(currentWeek);
    return `${startOfWeek.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;
  };

  if (isLoading) {
    return (
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-gray-600">Loading schedule...</p>
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
            <div className="flex items-center gap-4">
              <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/doctor/dashboard')}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">
                My Schedule
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Slot
              </Button>
            </div>
          </div>

          {/* Schedule Tabs */}
          <Tabs defaultValue="weekly" className="space-y-4">
            <TabsList>
              <TabsTrigger value="weekly" className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                Weekly View
              </TabsTrigger>
              <TabsTrigger value="monthly" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Monthly View
              </TabsTrigger>
            </TabsList>

            <TabsContent value="weekly" className="space-y-4">
              {/* Week Navigation */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <Button variant="ghost" size="sm" onClick={handlePreviousWeek}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <h3 className="font-semibold">
                      {getWeekDates()}
                    </h3>
                    <Button variant="ghost" size="sm" onClick={handleNextWeek}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Weekly Schedule Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
                {daysOfWeek.map((day, index) => (
                    <Card key={day} className={day === 'Sunday' ? 'opacity-50' : ''}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-center text-sm">
                          {dayNames[index]}
                          <div className="text-xs text-gray-500 mt-1">
                            {new Date(currentWeek.setDate(currentWeek.getDate() - currentWeek.getDay() + index)).toLocaleDateString()}
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {schedule[day] && schedule[day].length > 0 ? (
                            schedule[day].map((slot, slotIndex) => (
                                <TimeSlot key={slotIndex} slot={slot} />
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                              <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                              <p className="text-sm">Day Off / No Appointments</p>
                            </div>
                        )}
                      </CardContent>
                    </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="monthly" className="space-y-4">
              {/* Calendar */}
              <Card>
                <CardHeader>
                  <CardTitle>Calendar View</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md border"
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Schedule Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {Object.values(schedule).flat().filter(s => s.status !== 'available').length}
                </div>
                <div className="text-sm text-gray-600">Total Appointments</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {Object.values(schedule).flat().filter(s => s.status === 'available').length}
                </div>
                <div className="text-sm text-gray-600">Free Slots</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Object.keys(schedule).filter(day => schedule[day].length > 0).length}
                </div>
                <div className="text-sm text-gray-600">Working Days</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {/* This requires more complex logic, left as a placeholder */}
                  -
                </div>
                <div className="text-sm text-gray-600">Hours/Day</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  );
};

export default DoctorSchedulePage;