import { supabase } from './supabase';

export interface FAQ {
  id: string;
  question_fr: string;
  question_he: string;
  answer_fr: string;
  answer_he: string;
  sort_order: number;
  created_at: string;
}

export type CreateFAQDTO = Omit<FAQ, 'id' | 'created_at'>;
export type UpdateFAQDTO = Partial<CreateFAQDTO>;

export async function getFAQs(): Promise<FAQ[]> {
  const { data, error } = await supabase
    .from('faqs')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function createFAQ(faq: CreateFAQDTO): Promise<FAQ> {
  const { data, error } = await supabase
    .from('faqs')
    .insert(faq)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateFAQ(id: string, updates: UpdateFAQDTO): Promise<FAQ> {
  const { data, error } = await supabase
    .from('faqs')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteFAQ(id: string): Promise<void> {
  const { error } = await supabase
    .from('faqs')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
