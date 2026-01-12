import { supabase } from './supabase';
import type { ContactMessage, CreateContactDTO } from '../types';

export async function createContactMessage(
  contactData: CreateContactDTO
): Promise<ContactMessage> {
  const { data, error } = await supabase
    .from('contact_messages')
    .insert({ ...contactData, read: false })
    .select('*')
    .single();

  if (error) throw error;
  return data as ContactMessage;
}

export async function getContactMessages(
  read?: boolean
): Promise<ContactMessage[]> {
  let query = supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });

  if (read !== undefined) {
    query = query.eq('read', read);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as ContactMessage[];
}

export async function markMessageAsRead(
  id: string,
  read: boolean
): Promise<ContactMessage> {
  const { data, error } = await supabase
    .from('contact_messages')
    .update({ read })
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;
  return data as ContactMessage;
}

export async function deleteContactMessage(id: string): Promise<void> {
  const { error } = await supabase
    .from('contact_messages')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
