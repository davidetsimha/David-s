export type EventType =
  | 'bar_mitzvah'
  | 'bat_mitzvah'
  | 'brit'
  | 'private_party'
  | 'other';

export type QuoteStatus =
  | 'new'
  | 'contacted'
  | 'quoted'
  | 'confirmed'
  | 'rejected';

export interface QuoteRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  event_type: EventType;
  event_date: string;
  guest_count: number;
  message: string | null;
  status: QuoteStatus;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateQuoteDTO {
  name: string;
  email: string;
  phone: string;
  event_type: EventType;
  event_date: string;
  guest_count: number;
  message?: string;
}
