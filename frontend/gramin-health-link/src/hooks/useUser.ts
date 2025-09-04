import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/api';
import { toast } from 'sonner';

// Hook for fetching user profile
export const useUserProfile = () => {
  return useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const response = await apiClient.getMe();
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch user profile');
      }
      return response.data;
    },
  });
};

// Hook for updating user profile
export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: any) => {
      const response = await apiClient.updateMe(userData);
      if (!response.success) {
        throw new Error(response.error || 'Failed to update profile');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      toast.success('Profile updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update profile');
    },
  });
};

// Hook for submitting credentials (for doctors)
export const useSubmitCredentials = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await apiClient.submitCredentials(formData);
      if (!response.success) {
        throw new Error(response.error || 'Failed to submit credentials');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      toast.success('Credentials submitted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to submit credentials');
    },
  });
};
