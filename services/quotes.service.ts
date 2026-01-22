import { supabase } from './supabase';
import type { QuoteRequest, QuoteStatus, CreateQuoteDTO } from '../types';

export async function getQuotes(): Promise<QuoteRequest[]> {
  const { data, error } = await supabase
    .from('quote_requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as QuoteRequest[];
}

export async function createQuote(quoteData: CreateQuoteDTO): Promise<void> {
  const { error } = await supabase
    .from('quote_requests')
    .insert({ ...quoteData, status: 'new' });

  if (error) throw error;
}

export async function updateQuoteStatus(
  id: string,
  status: QuoteStatus
): Promise<QuoteRequest> {
  const { data, error } = await supabase
    .from('quote_requests')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;
  return data as QuoteRequest;
}

export async function updateQuoteNotes(
  id: string,
  adminNotes: string
): Promise<QuoteRequest> {
  const { data, error } = await supabase
    .from('quote_requests')
    .update({ admin_notes: adminNotes, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;
  return data as QuoteRequest;
}

// Analytics functions

export interface EventTypeStats {
  event_type: string;
  count: number;
  avg_guests: number;
}

export async function getEventTypeDistribution(): Promise<EventTypeStats[]> {
  const { data, error } = await supabase
    .from('quote_requests')
    .select('event_type, guest_count');

  if (error) throw error;

  const eventMap = new Map<string, { count: number; totalGuests: number }>();

  data?.forEach((quote) => {
    const existing = eventMap.get(quote.event_type);
    if (existing) {
      existing.count += 1;
      existing.totalGuests += quote.guest_count;
    } else {
      eventMap.set(quote.event_type, { count: 1, totalGuests: quote.guest_count });
    }
  });

  return Array.from(eventMap.entries())
    .map(([event_type, stats]) => ({
      event_type,
      count: stats.count,
      avg_guests: Math.round(stats.totalGuests / stats.count),
    }))
    .sort((a, b) => b.count - a.count);
}

export interface ConversionStats {
  total: number;
  confirmed: number;
  rejected: number;
  pending: number;
  rate: number;
}

export async function getQuoteConversionRate(): Promise<ConversionStats> {
  const { data, error } = await supabase
    .from('quote_requests')
    .select('status');

  if (error) throw error;

  const total = data?.length ?? 0;
  const confirmed = data?.filter((q) => q.status === 'confirmed').length ?? 0;
  const rejected = data?.filter((q) => q.status === 'rejected').length ?? 0;
  const pending = data?.filter((q) => ['new', 'contacted', 'quoted'].includes(q.status)).length ?? 0;

  return {
    total,
    confirmed,
    rejected,
    pending,
    rate: total > 0 ? Math.round((confirmed / total) * 100) : 0,
  };
}
