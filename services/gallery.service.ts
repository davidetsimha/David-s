import { supabase } from './supabase';
import type { GalleryImage, GalleryCategory } from '../types';

export type CreateGalleryImageDTO = {
  image_url: string;
  alt_fr?: string;
  alt_he?: string;
  category: GalleryCategory;
  sort_order?: number;
};

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

export async function createGalleryImage(image: CreateGalleryImageDTO): Promise<GalleryImage> {
  const { data, error } = await supabase
    .from('gallery_images')
    .insert(image)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteGalleryImage(id: string): Promise<void> {
  const { error } = await supabase
    .from('gallery_images')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
