import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/api';
import { toast } from 'sonner';

// Hook for fetching appointments
export const useAppointments = () => {
  return useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      const response = await apiClient.getAppointments();
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch appointments');
      }
      return response.data;
    },
  });
};

// Hook for booking an appointment
export const useBookAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (appointmentData: any) => {
      const response = await apiClient.bookAppointment(appointmentData);
      if (!response.success) {
        throw new Error(response.error || 'Failed to book appointment');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success('Appointment booked successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to book appointment');
    },
  });
};
