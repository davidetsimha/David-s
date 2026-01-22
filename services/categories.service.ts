import { supabase } from './supabase';
import type { Category, CreateCategoryDTO } from '../types';

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return data as Category[];
}

export async function getCategoryById(id: string): Promise<Category> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Category;
}

export async function createCategory(categoryData: CreateCategoryDTO): Promise<string> {
  const { data, error } = await supabase
    .from('categories')
    .insert(categoryData)
    .select('id')
    .single();

  if (error) throw error;
  return data.id;
}

export async function updateCategory(id: string, categoryData: Partial<CreateCategoryDTO>): Promise<Category> {
  const { data, error } = await supabase
    .from('categories')
    .update({ ...categoryData, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;
  return data as Category;
}

export async function deleteCategory(id: string): Promise<void> {
  // Check if category has products
  const { count, error: countError } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('category_id', id);

  if (countError) throw countError;

  if (count && count > 0) {
    throw new Error(`Impossible de supprimer cette categorie. Elle contient ${count} produit(s).`);
  }

  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
