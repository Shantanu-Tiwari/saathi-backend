import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/api';
import { toast } from 'sonner';

// Hook for fetching all pharmacies
export const usePharmacies = () => {
  return useQuery({
    queryKey: ['pharmacies'],
    queryFn: async () => {
      const response = await apiClient.getAllPharmacies();
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch pharmacies');
      }
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook for fetching a specific pharmacy
export const usePharmacy = (pharmacyId: string) => {
  return useQuery({
    queryKey: ['pharmacy', pharmacyId],
    queryFn: async () => {
      const response = await apiClient.getPharmacy(pharmacyId);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch pharmacy');
      }
      return response.data;
    },
    enabled: !!pharmacyId,
  });
};

// Hook for updating pharmacy inventory
export const useUpdateInventory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (inventoryData: any) => {
      const response = await apiClient.updateInventory(inventoryData);
      if (!response.success) {
        throw new Error(response.error || 'Failed to update inventory');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pharmacies'] });
      toast.success('Inventory updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update inventory');
    },
  });
};

// Hook for fetching prescription queue
export const usePrescriptionQueue = () => {
  return useQuery({
    queryKey: ['prescription-queue'],
    queryFn: async () => {
      const response = await apiClient.getPrescriptionQueue();
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch prescription queue');
      }
      return response.data;
    },
  });
};
