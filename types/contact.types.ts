export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  read: boolean;
  created_at: string;
}

export interface CreateContactDTO {
  name: string;
  email: string;
  phone?: string;
  message: string;
}
