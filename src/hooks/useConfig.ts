import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getConfig, getAllConfig, updateConfig } from '../services/config.service';

export function useConfig(key: string) {
  return useQuery({
    queryKey: ['config', key],
    queryFn: () => getConfig(key),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useAllConfig() {
  return useQuery({
    queryKey: ['config', 'all'],
    queryFn: getAllConfig,
  });
}

export function useUpdateConfig() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ key, value }: { key: string; value: string }) =>
      updateConfig(key, value),
    onSuccess: (_, { key }) => {
      queryClient.invalidateQueries({ queryKey: ['config', key] });
      queryClient.invalidateQueries({ queryKey: ['config', 'all'] });
    },
  });
}
