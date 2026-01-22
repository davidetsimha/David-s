export type ProductType = 'individual' | 'plateau';

export interface Product {
  id: string;
  name_fr: string;
  name_he: string;
  description_fr: string | null;
  description_he: string | null;
  price: number;
  image_url: string | null;
  category_id: string;
  available: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  category?: Category;
  // New fields for order system v2
  product_type: ProductType;
  requires_confirmation: boolean;
  min_days_advance: number;
}

export interface Category {
  id: string;
  name_fr: string;
  name_he: string;
  slug: string;
  sort_order: number;
}

export interface ProductFilters {
  category_id?: string;
  available?: boolean;
  search?: string;
  [key: string]: unknown;
}

export interface CreateProductDTO {
  name_fr: string;
  name_he: string;
  description_fr?: string;
  description_he?: string;
  price: number;
  image_url?: string;
  category_id: string;
  available?: boolean;
  sort_order?: number;
  // New fields for order system v2
  product_type?: ProductType;
  requires_confirmation?: boolean;
  min_days_advance?: number;
}

export interface CreateCategoryDTO {
  name_fr: string;
  name_he: string;
  slug: string;
  sort_order?: number;
}
