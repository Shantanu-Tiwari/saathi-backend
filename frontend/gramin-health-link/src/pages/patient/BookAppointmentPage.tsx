import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDoctorDetails, useDoctorSchedule } from '@/hooks/useDoctors';
import { useBookAppointment } from '@/hooks/useAppointments';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowLeft,
  Stethoscope,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';

const BookAppointmentPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const doctorId = searchParams.get('doctorId');

  const { data: doctorData, isLoading: doctorLoading, error: doctorError } = useDoctorDetails(doctorId || '');
  const { data: scheduleData } = useDoctorSchedule();
  const bookAppointmentMutation = useBookAppointment();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);

  // Mock available slots for now - in real implementation, this would come from the API
  useEffect(() => {
    if (selectedDate) {
      // Mock slots - replace with actual API call
      setAvailableSlots(['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']);
      setBookedSlots(['10:00', '15:00']); // Mock booked slots
    }
  }, [selectedDate]);

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedTime) {
      toast.error('Please select date and time');
      return;
    }

    if (!doctorId) {
      toast.error('Doctor ID not found');
      return;
    }

    bookAppointmentMutation.mutate({
      doctorId: doctorId,
      date: selectedDate.toISOString(),
      time: selectedTime,
      symptoms: symptoms
    }, {
      onSuccess: () => {
        navigate('/patient/appointments');
      }
    });
  };

  if (doctorLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading doctor details...</div>;
  }

  if (doctorError) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">Error: {doctorError.message}</div>;
  }

  if (!doctorId) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">Doctor ID not found</div>;
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
                  onClick={() => navigate('/patient/find-doctor')}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">
                Book Appointment
              </h1>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Doctor Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5" />
                  Doctor Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Stethoscope className="h-6 w-6 text-primary" />
                  </div>
                  {doctorData && (
                      <div>
                        <h3 className="text-lg font-semibold">{doctorData.name}</h3>
                        <p className="text-gray-600">{doctorData.specialty}</p>
                        <p className="text-sm text-gray-500">{doctorData.location}</p>
                        <div className="mt-2">
                          <Badge variant="outline">
                            Consultation Fee: ₹{doctorData.consultationFee}
                          </Badge>
                        </div>
                      </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Appointment Booking Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Select Date & Time
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Date Selection */}
                <div>
                  <h4 className="font-medium mb-2">Select Date</h4>
                  <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                      className="rounded-md border"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Time Slots */}
          {selectedDate && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Available Time Slots
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                    {availableSlots.map((time) => {
                      const isBooked = bookedSlots.includes(time);
                      const isSelected = selectedTime === time;

                      return (
                          <Button
                              key={time}
                              variant={isSelected ? 'default' : 'outline'}
                              size="sm"
                              disabled={isBooked}
                              onClick={() => setSelectedTime(time)}
                              className={`${isBooked ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            {time}
                          </Button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
          )}

          {/* Symptoms */}
          <Card>
            <CardHeader>
              <CardTitle>Describe Your Symptoms (Optional)</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                  placeholder="Please describe your symptoms or reason for consultation..."
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  rows={4}
              />
            </CardContent>
          </Card>

          {/* Appointment Summary */}
          {selectedDate && selectedTime && doctorData && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Appointment Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Doctor</p>
                      <p className="font-medium">{doctorData.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Specialty</p>
                      <p className="font-medium">{doctorData.specialty}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Date</p>
                      <p className="font-medium">
                        {selectedDate.toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Time</p>
                      <p className="font-medium">{selectedTime}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Consultation Fee</p>
                      <p className="font-medium text-primary">₹{doctorData.consultationFee}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-medium">{doctorData.location}</p>
                    </div>
                  </div>

                  {symptoms && (
                      <div>
                        <p className="text-sm text-gray-600">Symptoms</p>
                        <p className="font-medium">{symptoms}</p>
                      </div>
                  )}

                  <div className="pt-4 border-t">
                    <Button
                        onClick={handleBookAppointment}
                        disabled={bookAppointmentMutation.isPending}
                        className="w-full"
                        size="lg"
                    >
                      {bookAppointmentMutation.isPending ? 'Booking...' : `Book Appointment - ₹${doctorData?.consultationFee}`}
                    </Button>
                  </div>
                </CardContent>
              </Card>
          )}
        </div>
      </div>
  );
};

export default BookAppointmentPage;