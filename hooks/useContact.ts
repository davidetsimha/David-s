import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createContactMessage,
  getContactMessages,
  markMessageAsRead,
  deleteContactMessage,
} from '@/services/contact.service';
import type { CreateContactDTO } from '@/types';

export function useCreateContact() {
  return useMutation({
    mutationFn: (data: CreateContactDTO) => createContactMessage(data),
  });
}

export function useContactMessages(read?: boolean) {
  return useQuery({
    queryKey: ['contactMessages', read],
    queryFn: () => getContactMessages(read),
    refetchInterval: 30000,
  });
}

export function useMarkMessageAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, read }: { id: string; read: boolean }) =>
      markMessageAsRead(id, read),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contactMessages'] });
    },
  });
}

export function useDeleteContactMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteContactMessage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contactMessages'] });
    },
  });
}
