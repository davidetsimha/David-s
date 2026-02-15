import { supabase } from './supabase';
import type { Order, OrderStatus, CreateOrderDTO, ConfirmationStatus } from '../types';

export async function getOrders(status?: OrderStatus): Promise<Order[]> {
  let query = supabase
    .from('orders')
    .select('*, items:order_items(*)')
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

import crypto from 'crypto';

/**
 * Validate pickup date server-side
 * Note: This is a safety check. Frontend already validates dates.
 * For plateau orders, we're lenient since they require admin confirmation.
 */
function validatePickupDate(
  dateStr: string,
  orderType: 'individual' | 'plateau',
  minDaysAdvance: number
): void {
  // Parse date parts to avoid timezone issues
  // dateStr is in format "YYYY-MM-DD"
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day); // month is 0-indexed

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Not in the past
  if (date < today) {
    throw new Error('Date de retrait invalide (passée)');
  }

  // Not a Saturday (Shabbat) - getDay() now works correctly with local date
  if (date.getDay() === 6) {
    throw new Error('Retrait impossible le samedi');
  }

  const diffDays = Math.floor((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (orderType === 'individual') {
    // Individual: check minimum advance and Friday requirement
    if (minDaysAdvance > 0 && diffDays < minDaysAdvance) {
      throw new Error(`Délai minimum non respecté (${minDaysAdvance} jours requis)`);
    }

    if (date.getDay() !== 5) {
      throw new Error('Les commandes individuelles sont livrées uniquement le vendredi');
    }
  } else {
    // Plateau: enforce minimum 1 day (24h) advance for weekday pickup
    if (minDaysAdvance > 0 && diffDays < minDaysAdvance) {
      throw new Error(`Délai minimum non respecté (${minDaysAdvance} jour(s) requis)`);
    }
  }
}

export async function createOrder(orderData: CreateOrderDTO): Promise<string> {
  const { items, ...orderInfo } = orderData;

  // Generate idempotency key based on order content
  const idempotencyKey = crypto
    .createHash('sha256')
    .update(JSON.stringify({
      email: orderData.customer_email,
      items: items.map(i => `${i.product_id}:${i.quantity}`).sort(),
      date: orderData.pickup_date,
    }))
    .digest('hex')
    .substring(0, 32);

  // Check if order already exists (< 5 min)
  const { data: existingOrders } = await supabase
    .from('orders')
    .select('id')
    .eq('idempotency_key', idempotencyKey)
    .gte('created_at', new Date(Date.now() - 5 * 60 * 1000).toISOString())
    .limit(1);

  if (existingOrders && existingOrders.length > 0) {
    console.log('[Orders] Duplicate order detected, returning existing ID');
    return existingOrders[0].id;
  }

  // Validate pickup date server-side
  if (orderData.pickup_date) {
    const orderType = orderData.order_type || 'individual';
    // Plateau: minimum 1 day (24h) advance; individual: from product or 0
    const minDaysAdvance = orderType === 'plateau' ? 1 : 0;
    validatePickupDate(orderData.pickup_date, orderType, minDaysAdvance);
  }

  const totalAmount = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);

  // Add delivery zone price if applicable
  let finalTotal = totalAmount;
  if (orderData.delivery_zone_id) {
    const { data: zone, error: zoneError } = await supabase
      .from('delivery_zones')
      .select('price, active')
      .eq('id', orderData.delivery_zone_id)
      .single();

    if (zoneError || !zone) {
      throw new Error('Zone de livraison invalide ou supprimée');
    }
    if (!zone.active) {
      throw new Error('Zone de livraison non disponible');
    }
    finalTotal += Number(zone.price);
  }

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({ ...orderInfo, total_amount: finalTotal, status: 'pending', idempotency_key: idempotencyKey })
    .select('id, customer_name, total_amount, order_type, pickup_date')
    .single();

  if (orderError) throw orderError;

  const orderItems = items.map((item) => ({ ...item, order_id: order.id }));
  const { error: itemsError } = await supabase.from('order_items').insert(orderItems);

  if (itemsError) throw itemsError;

  // Send push notification for plateau orders
  if (orderInfo.order_type === 'plateau') {
    sendPushNotification({
      orderId: order.id,
      customerName: order.customer_name,
      totalAmount: order.total_amount,
      orderType: order.order_type,
      pickupDate: order.pickup_date,
    }).catch(console.error); // Don't block order creation if push fails
  }

  return order.id;
}

// Send push notification via Edge Function
async function sendPushNotification(payload: {
  orderId: string;
  customerName: string;
  totalAmount: number;
  orderType: string;
  pickupDate?: string;
}): Promise<void> {
  try {
    const { data, error } = await supabase.functions.invoke('send-push', {
      body: payload,
    });
    if (error) {
      console.error('Push notification error:', error);
    } else {
      console.log('Push notification sent:', data);
    }
  } catch (err) {
    console.error('Failed to send push notification:', err);
  }
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

// ============================================
// Order confirmation functions (for plateau orders)
// ============================================

export async function getOrdersByConfirmationStatus(
  confirmationStatus: ConfirmationStatus
): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*, items:order_items(*), delivery_zone:delivery_zones(*)')
    .eq('confirmation_status', confirmationStatus)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Order[];
}

export async function confirmPlateauOrder(
  id: string,
  paymentLink: string,
  adminNotes?: string
): Promise<Order> {
  const { data, error } = await supabase
    .from('orders')
    .update({
      confirmation_status: 'confirmed',
      payment_link: paymentLink,
      admin_notes: adminNotes || null,
    })
    .eq('id', id)
    .select('*, items:order_items(*)')
    .single();

  if (error) throw error;
  return data as Order;
}

export async function rejectPlateauOrder(id: string, reason: string): Promise<Order> {
  const { data, error } = await supabase
    .from('orders')
    .update({
      confirmation_status: 'rejected',
      status: 'cancelled',
      admin_notes: reason,
    })
    .eq('id', id)
    .select('*, items:order_items(*)')
    .single();

  if (error) throw error;
  return data as Order;
}

export async function updateOrderAdminNotes(id: string, notes: string): Promise<Order> {
  const { data, error } = await supabase
    .from('orders')
    .update({ admin_notes: notes })
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;
  return data as Order;
}

// Analytics functions

export interface RevenueDataPoint {
  date: string;
  revenue: number;
  orders: number;
}

export async function getRevenueByDateRange(days: number): Promise<RevenueDataPoint[]> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data, error } = await supabase
    .from('orders')
    .select('created_at, total_amount')
    .gte('created_at', startDate.toISOString())
    .order('created_at', { ascending: true });

  if (error) throw error;

  // Group by date
  const revenueByDate = new Map<string, RevenueDataPoint>();

  // Initialize all days
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - i));
    const dateStr = date.toISOString().split('T')[0];
    revenueByDate.set(dateStr, { date: dateStr, revenue: 0, orders: 0 });
  }

  // Fill with actual data
  data?.forEach((order) => {
    const dateStr = order.created_at.split('T')[0];
    const existing = revenueByDate.get(dateStr);
    if (existing) {
      existing.revenue += Number(order.total_amount);
      existing.orders += 1;
    }
  });

  return Array.from(revenueByDate.values());
}

export interface TopProduct {
  product_name_fr: string;
  product_name_he: string;
  quantity: number;
  revenue: number;
}

export async function getTopSellingProducts(limit: number = 5): Promise<TopProduct[]> {
  const { data, error } = await supabase
    .from('order_items')
    .select('product_name_fr, product_name_he, quantity, unit_price');

  if (error) throw error;

  // Aggregate by product name
  const productMap = new Map<string, TopProduct>();

  data?.forEach((item) => {
    const key = item.product_name_fr;
    const existing = productMap.get(key);
    if (existing) {
      existing.quantity += Number(item.quantity);
      existing.revenue += Number(item.quantity) * Number(item.unit_price);
    } else {
      productMap.set(key, {
        product_name_fr: item.product_name_fr,
        product_name_he: item.product_name_he,
        quantity: Number(item.quantity),
        revenue: Number(item.quantity) * Number(item.unit_price),
      });
    }
  });

  return Array.from(productMap.values())
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, limit);
}

export interface CategorySales {
  category_name: string;
  total: number;
  count: number;
}

export async function getSalesByCategory(): Promise<CategorySales[]> {
  const { data: items, error: itemsError } = await supabase
    .from('order_items')
    .select('product_id, quantity, unit_price');

  if (itemsError) throw itemsError;

  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, category_id, categories(name_fr)');

  if (productsError) throw productsError;

  // Create product to category map
  const productCategoryMap = new Map<string, string>();
  products?.forEach((p: any) => {
    productCategoryMap.set(p.id, p.categories?.name_fr || 'Autre');
  });

  // Aggregate by category
  const categoryMap = new Map<string, CategorySales>();

  items?.forEach((item) => {
    const category = item.product_id ? productCategoryMap.get(item.product_id) || 'Autre' : 'Autre';
    const existing = categoryMap.get(category);
    const itemTotal = Number(item.quantity) * Number(item.unit_price);

    if (existing) {
      existing.total += itemTotal;
      existing.count += Number(item.quantity);
    } else {
      categoryMap.set(category, {
        category_name: category,
        total: itemTotal,
        count: Number(item.quantity),
      });
    }
  });

  return Array.from(categoryMap.values()).sort((a, b) => b.total - a.total);
}
