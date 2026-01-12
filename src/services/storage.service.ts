/**
 * Supabase Storage Service
 *
 * IMPORTANT: Créer le bucket "images" dans Supabase Dashboard:
 * 1. Aller sur https://supabase.com/dashboard/project/[project-id]/storage/buckets
 * 2. Créer un nouveau bucket nommé "images"
 * 3. Activer "Public bucket" pour permettre l'accès public aux images
 */

import { supabase } from './supabase';

const BUCKET_NAME = 'images';

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Upload une image vers Supabase Storage
 * @param file Le fichier à uploader
 * @param folder Le dossier de destination (products, gallery, events, creations)
 * @returns L'URL publique de l'image
 */
export async function uploadImage(
  file: File,
  folder: 'products' | 'gallery' | 'events' | 'creations' = 'products'
): Promise<UploadResult> {
  try {
    // Générer un nom unique pour éviter les collisions
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    // Upload vers Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Upload error:', error);
      return { success: false, error: error.message };
    }

    // Obtenir l'URL publique
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path);

    return {
      success: true,
      url: urlData.publicUrl,
    };
  } catch (error) {
    console.error('Upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}

/**
 * Supprime une image de Supabase Storage
 * @param url L'URL publique de l'image
 */
export async function deleteImage(url: string): Promise<boolean> {
  try {
    // Extraire le chemin du fichier depuis l'URL
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/storage/v1/object/public/images/');
    if (pathParts.length !== 2) {
      console.error('Invalid image URL format');
      return false;
    }

    const filePath = pathParts[1];

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (error) {
      console.error('Delete error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Delete error:', error);
    return false;
  }
}

/**
 * Liste les images dans un dossier
 * @param folder Le dossier à lister
 */
export async function listImages(folder: string): Promise<string[]> {
  try {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list(folder, {
        limit: 100,
        sortBy: { column: 'created_at', order: 'desc' },
      });

    if (error) {
      console.error('List error:', error);
      return [];
    }

    return data
      .filter(item => !item.id.endsWith('/')) // Exclure les dossiers
      .map(item => {
        const { data: urlData } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(`${folder}/${item.name}`);
        return urlData.publicUrl;
      });
  } catch (error) {
    console.error('List error:', error);
    return [];
  }
}
