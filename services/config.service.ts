import { supabase } from './supabase';

export interface SiteConfig {
  key: string;
  value: string;
  description: string | null;
  updated_at: string;
}

export async function getConfig(key: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('site_config')
    .select('value')
    .eq('key', key)
    .single();

  if (error) {
    console.error('Error fetching config:', error);
    return null;
  }
  return data?.value ?? null;
}

export async function getAllConfig(): Promise<SiteConfig[]> {
  const { data, error } = await supabase
    .from('site_config')
    .select('*')
    .order('key');

  if (error) throw error;
  return data as SiteConfig[];
}

export async function updateConfig(key: string, value: string): Promise<void> {
  const { error } = await supabase
    .from('site_config')
    .update({ value })
    .eq('key', key);

  if (error) throw error;
}
