import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile, useUpdateUserProfile } from '@/hooks/useUser';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  User,
  Phone,
  Calendar,
  Users,
  Edit3,
  Save,
  LogOut,
  Shield
} from 'lucide-react';
import { toast } from 'sonner';

const PatientProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { data: userProfile, isLoading, error } = useUserProfile();
  const updateProfileMutation = useUpdateUserProfile();
  
  const [isEditing, setIsEditing] = useState(false);

  const [patientData, setPatientData] = useState({
    name: '',
    phone: '',
    email: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    address: '',
    emergencyContact: '',
    emergencyContactName: '',
    medicalHistory: '',
    allergies: '',
    currentMedications: ''
  });

  // Update patient data when user profile is loaded
  useEffect(() => {
    if (userProfile) {
      setPatientData({
        name: userProfile.name || '',
        phone: userProfile.phone || '',
        email: userProfile.email || '',
        dateOfBirth: userProfile.dateOfBirth || '',
        gender: userProfile.gender || '',
        bloodGroup: userProfile.bloodGroup || '',
        address: userProfile.address || '',
        emergencyContact: userProfile.emergencyContact || '',
        emergencyContactName: userProfile.emergencyContactName || '',
        medicalHistory: userProfile.medicalHistory || '',
        allergies: userProfile.allergies || '',
        currentMedications: userProfile.currentMedications || ''
      });
    }
  }, [userProfile]);


  const handleSave = async () => {
    updateProfileMutation.mutate(patientData, {
      onSuccess: () => {
        setIsEditing(false);
      }
    });
  };

  const handleInputChange = (field, value) => {
    setPatientData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading profile...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">Error: {error.message}</div>;
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
                My Profile
              </h1>
            </div>

            <div className="flex items-center gap-2">
              {isEditing ? (
                  <>
                    <Button
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                        disabled={updateProfileMutation.isPending}
                    >
                      Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={updateProfileMutation.isPending}
                    >
                      <Save className="h-4 w-4 mr-1" />
                      {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </>
              ) : (
                  <Button onClick={() => setIsEditing(true)}>
                    <Edit3 className="h-4 w-4 mr-1" />
                    Edit Profile
                  </Button>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Profile Summary */}
            <Card>
              <CardContent className="p-6 text-center">
                <div className="bg-primary/10 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <User className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{patientData.name}</h3>
                <p className="text-gray-600 mb-1">{patientData.phone}</p>
                <p className="text-gray-600 mb-4">{patientData.email}</p>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Blood Group:</span>
                    <span className="font-medium">{patientData.bloodGroup}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gender:</span>
                    <span className="font-medium capitalize">{patientData.gender}</span>
                  </div>
                </div>

                <Separator className="my-4" />

                <Button
                    variant="outline"
                    size="sm"
                    onClick={logout}
                    className="w-full"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </Button>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                          id="name"
                          value={patientData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          disabled={!isEditing}
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                          id="phone"
                          value={patientData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          disabled={!isEditing}
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                          id="email"
                          type="email"
                          value={patientData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          disabled={!isEditing}
                      />
                    </div>

                    <div>
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Input
                          id="dob"
                          type="date"
                          value={patientData.dateOfBirth}
                          onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                          disabled={!isEditing}
                      />
                    </div>

                    <div>
                      <Label htmlFor="gender">Gender</Label>
                      <Select
                          value={patientData.gender}
                          onValueChange={(value) => handleInputChange('gender', value)}
                          disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="bloodGroup">Blood Group</Label>
                      <Select
                          value={patientData.bloodGroup}
                          onValueChange={(value) => handleInputChange('bloodGroup', value)}
                          disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A+">A+</SelectItem>
                          <SelectItem value="A-">A-</SelectItem>
                          <SelectItem value="B+">B+</SelectItem>
                          <SelectItem value="B-">B-</SelectItem>
                          <SelectItem value="AB+">AB+</SelectItem>
                          <SelectItem value="AB-">AB-</SelectItem>
                          <SelectItem value="O+">O+</SelectItem>
                          <SelectItem value="O-">O-</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                        id="address"
                        value={patientData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        disabled={!isEditing}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Emergency Contact */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Emergency Contact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="emergencyName">Contact Name</Label>
                      <Input
                          id="emergencyName"
                          value={patientData.emergencyContactName}
                          onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
                          disabled={!isEditing}
                      />
                    </div>

                    <div>
                      <Label htmlFor="emergencyPhone">Contact Phone</Label>
                      <Input
                          id="emergencyPhone"
                          value={patientData.emergencyContact}
                          onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                          disabled={!isEditing}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Medical Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Medical Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="medicalHistory">Medical History</Label>
                    <Input
                        id="medicalHistory"
                        value={patientData.medicalHistory}
                        onChange={(e) => handleInputChange('medicalHistory', e.target.value)}
                        disabled={!isEditing}
                        placeholder="Any chronic conditions or past surgeries"
                    />
                  </div>

                  <div>
                    <Label htmlFor="allergies">Allergies</Label>
                    <Input
                        id="allergies"
                        value={patientData.allergies}
                        onChange={(e) => handleInputChange('allergies', e.target.value)}
                        disabled={!isEditing}
                        placeholder="Any known allergies"
                    />
                  </div>

                  <div>
                    <Label htmlFor="medications">Current Medications</Label>
                    <Input
                        id="medications"
                        value={patientData.currentMedications}
                        onChange={(e) => handleInputChange('currentMedications', e.target.value)}
                        disabled={!isEditing}
                        placeholder="Current medications and dosages"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
  );
};

export default PatientProfilePage;