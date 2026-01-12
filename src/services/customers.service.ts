import { supabase } from './supabase';
import type { Customer } from '../types';
import type { Order } from '../types';

export async function getCustomers(): Promise<Customer[]> {
  const { data, error } = await supabase.rpc('get_customers_summary');

  if (error) {
    // Fallback to manual aggregation if RPC doesn't exist
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('customer_email, customer_name, customer_phone, total_amount, created_at');

    if (ordersError) throw ordersError;

    // Group by email
    const customersMap = new Map<string, Customer>();

    orders?.forEach((order) => {
      const email = order.customer_email;
      const existing = customersMap.get(email);

      if (existing) {
        existing.total_orders += 1;
        existing.total_spent += order.total_amount;
        if (new Date(order.created_at) > new Date(existing.last_order_date)) {
          existing.last_order_date = order.created_at;
          existing.name = order.customer_name;
          existing.phone = order.customer_phone;
        }
      } else {
        customersMap.set(email, {
          email,
          name: order.customer_name,
          phone: order.customer_phone || '',
          total_orders: 1,
          total_spent: order.total_amount,
          last_order_date: order.created_at,
        });
      }
    });

    // Sort by total spent descending
    return Array.from(customersMap.values()).sort(
      (a, b) => b.total_spent - a.total_spent
    );
  }

  return data as Customer[];
}

export async function getCustomerOrders(email: string): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      items:order_items(*)
    `)
    .eq('customer_email', email)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Order[];
}
