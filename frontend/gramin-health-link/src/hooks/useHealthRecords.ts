import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/api';
import { toast } from 'sonner';

// Hook for fetching health records
export const useHealthRecords = () => {
  return useQuery({
    queryKey: ['health-records'],
    queryFn: async () => {
      const response = await apiClient.getHealthRecords();
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch health records');
      }
      return response.data;
    },
  });
};

// Hook for fetching a specific health record
export const useHealthRecord = (recordId: string) => {
  return useQuery({
    queryKey: ['health-record', recordId],
    queryFn: async () => {
      const response = await apiClient.getHealthRecordById(recordId);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch health record');
      }
      return response.data;
    },
    enabled: !!recordId,
  });
};

// Hook for creating a health record
export const useCreateHealthRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (healthRecordData: any) => {
      const response = await apiClient.createHealthRecord(healthRecordData);
      if (!response.success) {
        throw new Error(response.error || 'Failed to create health record');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health-records'] });
      toast.success('Health record created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create health record');
    },
  });
};
