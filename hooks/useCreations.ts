import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/config/queryClient';
import {
  getCreations,
  createCreation,
  updateCreation,
  deleteCreation,
  type CreateCreationDTO,
  type UpdateCreationDTO,
} from '@/services/creations.service';

export function useCreations() {
  return useQuery({
    queryKey: queryKeys.creations.list(),
    queryFn: getCreations,
  });
}

export function useCreateCreation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCreationDTO) => createCreation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.creations.all });
    },
  });
}

export function useUpdateCreation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCreationDTO }) =>
      updateCreation(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.creations.all });
    },
  });
}

export function useDeleteCreation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCreation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.creations.all });
    },
  });
}
