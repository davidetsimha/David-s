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
    const body = await request.json();
    const { orderId } = body;

    console.log('[Payment/GenerateLink] Received request:', { body, orderId });

    if (!orderId) {
      return NextResponse.json({ error: 'Missing orderId', received: body }, { status: 400 });
    }

    const supabase = getSupabase();

    // First, try without .single() to see what we get
    const { data: orders, error: listError } = await supabase
      .from('orders')
      .select('id, customer_name, customer_email, customer_phone, total_amount, order_type')
      .eq('id', orderId);

    console.log('[Payment/GenerateLink] Query result:', { orderId, orders, listError });

    if (listError) {
      return NextResponse.json({
        error: 'Database error',
        details: listError.message,
        orderId,
        hint: listError.hint
      }, { status: 500 });
    }

    if (!orders || orders.length === 0) {
      return NextResponse.json({
        error: 'Order not found',
        orderId,
        orderCount: orders?.length || 0
      }, { status: 404 });
    }

    if (orders.length > 1) {
      return NextResponse.json({
        error: 'Multiple orders found',
        orderId,
        orderCount: orders.length
      }, { status: 500 });
    }

    const order = orders[0];

    // Verify this is a plateau order pending payment
    if (order.order_type !== 'plateau') {
      return NextResponse.json({ error: 'Only plateau orders can use this endpoint' }, { status: 400 });
    }

    // Generate payment link - use the correct production URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.davids-patisserie.co.il';

    const response = await createSignedPaymentUrl({
      orderId: order.id,
      amount: Number(order.total_amount),
      currency: 'ILS',
      description: `Commande plateau`,
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
      return NextResponse.json({
        error: response.errorMessage || 'Failed to generate link',
        errorCode: response.errorCode,
        hypResponse: response
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      paymentUrl: response.paymentPageUrl,
    });
  } catch (error) {
    console.error('[Payment/GenerateLink] Error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Server error',
      stack: error instanceof Error ? error.stack : undefined,
      hasHypCredentials: !!(process.env.HYP_TERMINAL_ID && process.env.HYP_API_KEY)
    }, { status: 500 });
  }
}
