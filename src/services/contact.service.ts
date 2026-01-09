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
