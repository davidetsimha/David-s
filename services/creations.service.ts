import { supabase } from './supabase';

export interface Creation {
  id: string;
  title_fr: string;
  title_he: string;
  description_fr: string | null;
  description_he: string | null;
  image_url: string;
  sort_order: number;
  created_at: string;
}

export type CreateCreationDTO = Omit<Creation, 'id' | 'created_at'>;
export type UpdateCreationDTO = Partial<CreateCreationDTO>;

export async function getCreations(): Promise<Creation[]> {
  const { data, error } = await supabase
    .from('creations')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function createCreation(creation: CreateCreationDTO): Promise<Creation> {
  const { data, error } = await supabase
    .from('creations')
    .insert(creation)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateCreation(id: string, updates: UpdateCreationDTO): Promise<Creation> {
  const { data, error } = await supabase
    .from('creations')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteCreation(id: string): Promise<void> {
  const { error } = await supabase
    .from('creations')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
