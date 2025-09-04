import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/api';
import { toast } from 'sonner';

// Hook for fetching all doctors
export const useDoctors = () => {
  return useQuery({
    queryKey: ['doctors'],
    queryFn: async () => {
      const response = await apiClient.getDoctors();
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch doctors');
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for fetching doctor details
export const useDoctorDetails = (doctorId: string) => {
  return useQuery({
    queryKey: ['doctor', doctorId],
    queryFn: async () => {
      const response = await apiClient.getDoctorDetails(doctorId);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch doctor details');
      }
      return response.data;
    },
    enabled: !!doctorId,
  });
};

// Hook for fetching doctor schedule
export const useDoctorSchedule = () => {
  return useQuery({
    queryKey: ['doctor-schedule'],
    queryFn: async () => {
      const response = await apiClient.getDoctorSchedule();
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch doctor schedule');
      }
      return response.data;
    },
  });
};

// Hook for adding a new slot
export const useAddSlot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (slotData: any) => {
      const response = await apiClient.addSlot(slotData);
      if (!response.success) {
        throw new Error(response.error || 'Failed to add slot');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctor-schedule'] });
      toast.success('Slot added successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add slot');
    },
  });
};
