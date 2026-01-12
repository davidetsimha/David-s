import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../config/queryClient';
import {
  getFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  type CreateFAQDTO,
  type UpdateFAQDTO,
} from '../services/faq.service';

export function useFAQs() {
  return useQuery({
    queryKey: queryKeys.faqs.list(),
    queryFn: getFAQs,
  });
}

export function useCreateFAQ() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateFAQDTO) => createFAQ(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.faqs.all });
    },
  });
}

export function useUpdateFAQ() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFAQDTO }) =>
      updateFAQ(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.faqs.all });
    },
  });
}

export function useDeleteFAQ() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteFAQ(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.faqs.all });
    },
  });
}
