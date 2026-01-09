import { useMutation } from '@tanstack/react-query';
import { createContactMessage } from '../services/contact.service';
import type { CreateContactDTO } from '../types';

export function useCreateContact() {
  return useMutation({
    mutationFn: (data: CreateContactDTO) => createContactMessage(data),
  });
}
