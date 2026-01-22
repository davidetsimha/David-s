export type TimeSlot = 'morning' | 'afternoon';

export interface EventFormula {
  id: string;
  name_fr: string;
  name_he: string;
  tagline_fr: string;
  tagline_he: string;
  price: number;
  min_guests: number;
  time_slot: TimeSlot;
  includes_fr: string[];
  includes_he: string[];
  image_url: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface UpdateEventFormulaDTO {
  name_fr?: string;
  name_he?: string;
  tagline_fr?: string;
  tagline_he?: string;
  price?: number;
  min_guests?: number;
  includes_fr?: string[];
  includes_he?: string[];
  image_url?: string | null;
  sort_order?: number;
}
