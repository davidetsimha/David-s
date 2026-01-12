import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../config/queryClient';
import {
  getQuotes,
  createQuote,
  updateQuoteStatus,
  updateQuoteNotes,
  getEventTypeDistribution,
  getQuoteConversionRate,
} from '../services/quotes.service';
import type { QuoteStatus, CreateQuoteDTO } from '../types';

export function useQuotes() {
  return useQuery({
    queryKey: queryKeys.quotes.list(),
    queryFn: getQuotes,
  });
}

export function useCreateQuote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateQuoteDTO) => createQuote(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.quotes.all });
    },
  });
}

export function useUpdateQuoteStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: QuoteStatus }) =>
      updateQuoteStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.quotes.all });
    },
  });
}

export function useUpdateQuoteNotes() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes: string }) =>
      updateQuoteNotes(id, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.quotes.all });
    },
  });
}

// Analytics hooks

export function useEventTypeDistribution() {
  return useQuery({
    queryKey: ['analytics', 'eventTypes'],
    queryFn: getEventTypeDistribution,
  });
}

export function useQuoteConversionRate() {
  return useQuery({
    queryKey: ['analytics', 'quoteConversion'],
    queryFn: getQuoteConversionRate,
  });
}
