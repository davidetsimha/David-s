import { supabase } from './supabase';

export interface EventType {
  id: string;
  slug: string;
  title_fr: string;
  title_he: string;
  description_fr: string | null;
  description_he: string | null;
  image_url: string | null;
  sort_order: number;
  created_at: string;
}

export type UpdateEventTypeDTO = Partial<Omit<EventType, 'id' | 'slug' | 'created_at'>>;

export async function getEventTypes(): Promise<EventType[]> {
  const { data, error } = await supabase
    .from('event_types')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function updateEventType(id: string, updates: UpdateEventTypeDTO): Promise<EventType> {
  const { data, error } = await supabase
    .from('event_types')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
