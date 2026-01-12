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

export async function createQuote(quoteData: CreateQuoteDTO): Promise<QuoteRequest> {
  const { data, error } = await supabase
    .from('quote_requests')
    .insert({ ...quoteData, status: 'new' })
    .select('*')
    .single();

  if (error) throw error;
  return data as QuoteRequest;
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
