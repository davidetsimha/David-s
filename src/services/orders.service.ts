import { supabase } from './supabase';
import type { Order, OrderStatus, CreateOrderDTO } from '../types';

export async function getOrders(status?: OrderStatus): Promise<Order[]> {
  let query = supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Order[];
}

export async function getOrderById(id: string): Promise<Order> {
  const { data, error } = await supabase
    .from('orders')
    .select('*, items:order_items(*)')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Order;
}

export async function createOrder(orderData: CreateOrderDTO): Promise<string> {
  const { items, ...orderInfo } = orderData;
  const totalAmount = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({ ...orderInfo, total_amount: totalAmount, status: 'pending' })
    .select('id')
    .single();

  if (orderError) throw orderError;

  const orderItems = items.map((item) => ({ ...item, order_id: order.id }));
  const { error: itemsError } = await supabase.from('order_items').insert(orderItems);

  if (itemsError) throw itemsError;
  return order.id;
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;
  return data as Order;
}
