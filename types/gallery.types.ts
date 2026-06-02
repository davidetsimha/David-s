export type GalleryCategory =
  | 'receptions'
  | 'products'
  | 'wedding'
  | 'bar_mitzvah'
  | 'bat_mitzvah'
  | 'brit'
  | 'event';

export interface GalleryImage {
  id: string;
  image_url: string;
  alt_fr: string;
  alt_he: string;
  category: GalleryCategory;
  sort_order: number;
  created_at: string;
}
