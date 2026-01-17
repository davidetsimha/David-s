export type OrderStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type DeliveryType = 'delivery' | 'pickup';
export type OrderType = 'individual' | 'plateau';
export type ConfirmationStatus = 'not_required' | 'pending_confirmation' | 'confirmed' | 'rejected';

export interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_type: DeliveryType;
  delivery_address: string | null;
  notes: string | null;
  status: OrderStatus;
  total_amount: number;
  created_at: string;
  items?: OrderItem[];
  // New fields for order system v2
  pickup_date: string | null;
  pickup_time_slot: string | null;
  order_type: OrderType;
  confirmation_status: ConfirmationStatus;
  admin_notes: string | null;
  payment_link: string | null;
  is_late_order: boolean;
  delivery_zone_id: string | null;
  delivery_zone?: DeliveryZone;
}

export interface DeliveryZone {
  id: string;
  name_fr: string;
  name_he: string;
  price: number;
  sort_order: number;
  active: boolean;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  quantity: number;
  unit_price: number;
  product_name_fr: string;
  product_name_he: string;
}

export interface CreateOrderDTO {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_type: DeliveryType;
  delivery_address?: string;
  notes?: string;
  items: CreateOrderItemDTO[];
  // New fields for order system v2
  pickup_date?: string;
  pickup_time_slot?: string;
  order_type?: OrderType;
  confirmation_status?: ConfirmationStatus;
  is_late_order?: boolean;
  delivery_zone_id?: string;
}

export interface CreateOrderItemDTO {
  product_id: string;
  quantity: number;
  unit_price: number;
  product_name_fr: string;
  product_name_he: string;
}
