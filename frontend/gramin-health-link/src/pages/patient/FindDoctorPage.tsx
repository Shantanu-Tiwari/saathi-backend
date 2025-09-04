import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Stethoscope,
  Star,
  Clock,
  ArrowLeft,
  MapPin,
  Phone,
} from 'lucide-react';

const FindDoctorPage = () => {
  const navigate = useNavigate();
  const { token } = useAuth(); // Assuming the useAuth hook provides a token

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch(`${API_URL}/api/v1/doctors`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch doctors.');
        }

        setDoctors(data.doctors);
      } catch (err) {
        console.error('API Error:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchDoctors();
    }
  }, [token]);

  const specialties = [
    { value: 'all', label: 'All' },
    { value: 'general', label: 'General Physician' },
    { value: 'pediatric', label: 'Pediatrician' },
    { value: 'cardiology', label: 'Cardiologist' },
    { value: 'gynecology', label: 'Gynecologist' },
  ];

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty =
        selectedSpecialty === 'all' ||
        doctor.specialty.toLowerCase().includes(selectedSpecialty);
    return matchesSearch && matchesSpecialty;
  });

  const handleBookAppointment = (doctorId) => {
    navigate(`/patient/book-appointment?doctorId=${doctorId}`);
  };

  if (isLoading) {
    return (
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-gray-600">Loading doctors...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Find Doctor</h1>
            </div>
          </div>

          {/* Search and Filter */}
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                      placeholder="Search doctor name or specialty"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                  />
                </div>

                <div className="flex gap-2 flex-wrap">
                  {specialties.map((specialty) => (
                      <Button
                          key={specialty.value}
                          variant={selectedSpecialty === specialty.value ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setSelectedSpecialty(specialty.value)}
                      >
                        {specialty.label}
                      </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Doctors List */}
          <div className="space-y-4">
            {filteredDoctors.length > 0 ? (
                filteredDoctors.map((doctor) => (
                    <Card key={doctor._id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <div className="bg-primary/10 p-3 rounded-full">
                              <Stethoscope className="h-6 w-6 text-primary" />
                            </div>

                            <div className="space-y-2">
                              <div>
                                <h3 className="text-lg font-semibold">{doctor.name}</h3>
                                <p className="text-gray-600">{doctor.specialty}</p>
                              </div>

                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                  <span>{doctor.rating}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{doctor.experience}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  <span>{doctor.location}</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <Badge variant={doctor.available ? 'default' : 'secondary'}>
                                  {doctor.available ? 'Available' : 'Unavailable'}
                                </Badge>
                                {doctor.available && (
                                    <span className="text-sm text-green-600">Next slot: {doctor.nextSlot}</span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="text-right space-y-2">
                            <div>
                              <p className="text-lg font-semibold text-primary">₹{doctor.consultationFee}</p>
                              <p className="text-sm text-gray-600">Consultation Fee</p>
                            </div>

                            <Button
                                onClick={() => handleBookAppointment(doctor._id)}
                                disabled={!doctor.available}
                                className="w-full"
                            >
                              {doctor.available ? 'Book Appointment' : 'Unavailable'}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                ))
            ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <Stethoscope className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No doctors found</p>
                    <p className="text-sm text-gray-500 mt-1">Please modify your search</p>
                  </CardContent>
                </Card>
            )}
          </div>
        </div>
      </div>
  );
};

export default FindDoctorPage;