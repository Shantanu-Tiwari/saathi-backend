import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/api';
import { toast } from 'sonner';

// Hook for fetching prescriptions
export const usePrescriptions = () => {
  return useQuery({
    queryKey: ['prescriptions'],
    queryFn: async () => {
      const response = await apiClient.getPrescriptions();
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch prescriptions');
      }
      return response.data;
    },
  });
};

// Hook for creating a prescription
export const useCreatePrescription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (prescriptionData: any) => {
      const response = await apiClient.createPrescription(prescriptionData);
      if (!response.success) {
        throw new Error(response.error || 'Failed to create prescription');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prescriptions'] });
      toast.success('Prescription created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create prescription');
    },
  });
};
