export type OrderStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type DeliveryType = 'delivery' | 'pickup';

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
}

export interface CreateOrderItemDTO {
  product_id: string;
  quantity: number;
  unit_price: number;
  product_name_fr: string;
  product_name_he: string;
}
