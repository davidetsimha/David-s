import { supabase } from './supabase';
import type { GalleryImage, GalleryCategory } from '../types';

export async function getGalleryImages(category?: GalleryCategory): Promise<GalleryImage[]> {
  let query = supabase
    .from('gallery_images')
    .select('*')
    .order('sort_order', { ascending: true });

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as GalleryImage[];
}
