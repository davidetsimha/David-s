import { NextRequest, NextResponse } from 'next/server';
import { createSignedPaymentUrl } from '@/services/hyp.service';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });
    }

    const supabase = getSupabase();

    // Get order details
    const { data: order, error } = await supabase
      .from('orders')
      .select('*, items:order_items(*)')
      .eq('id', orderId)
      .single();

    if (error || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Verify this is a plateau order pending payment
    if (order.order_type !== 'plateau') {
      return NextResponse.json({ error: 'Only plateau orders can use this endpoint' }, { status: 400 });
    }

    // Generate signed payment link
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://davids-patisserie.vercel.app';

    const response = await createSignedPaymentUrl({
      orderId: order.id,
      amount: Number(order.total_amount),
      currency: 'ILS',
      description: `Plateau ${order.id.slice(0, 8)}`,
      customer: {
        name: order.customer_name,
        email: order.customer_email,
        phone: order.customer_phone,
      },
      successUrl: `${baseUrl}/fr/boutique/checkout/success?order_id=${order.id}`,
      cancelUrl: `${baseUrl}/fr/boutique/checkout/cancel?order_id=${order.id}`,
      callbackUrl: `${baseUrl}/api/payment/callback`,
      language: 'he',
    });

    if (!response.success || !response.paymentPageUrl) {
      return NextResponse.json({ error: response.errorMessage || 'Failed to generate link' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      paymentUrl: response.paymentPageUrl,
    });
  } catch (error) {
    console.error('[Payment/GenerateLink] Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
