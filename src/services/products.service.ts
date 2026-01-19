import { supabase } from './supabase';
import type { Product, ProductFilters, CreateProductDTO } from '../types';

export async function getProducts(filters?: ProductFilters): Promise<Product[]> {
  let query = supabase
    .from('products')
    .select('*, category:categories(*)')
    .order('sort_order', { ascending: true });

  if (filters?.category_id) {
    query = query.eq('category_id', filters.category_id);
  }
  if (filters?.available !== undefined) {
    query = query.eq('available', filters.available);
  }
  if (filters?.search) {
    query = query.or(`name_fr.ilike.%${filters.search}%,name_he.ilike.%${filters.search}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Product[];
}

export async function getProductById(id: string): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Product;
}

export async function createProduct(productData: CreateProductDTO): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .insert(productData)
    .select('*, category:categories(*)')
    .single();

  if (error) throw error;
  return data as Product;
}

export async function updateProduct(
  id: string,
  productData: Partial<CreateProductDTO>
): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .update({ ...productData, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*, category:categories(*)')
    .single();

  if (error) throw error;
  return data as Product;
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
}

export async function bulkUpdateProductAvailability(
  ids: string[],
  available: boolean
): Promise<void> {
  if (ids.length === 0) return;

  const { error } = await supabase
    .from('products')
    .update({ available, updated_at: new Date().toISOString() })
    .in('id', ids);

  if (error) throw error;
}
