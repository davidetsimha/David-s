import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Create a Supabase client for server-side operations
function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error('Missing Supabase credentials');
  }

  return createClient(url, key);
}

export type PaymentStatusResponse = {
  success: boolean;
  status: 'pending' | 'confirmed' | 'failed' | 'not_found';
  orderId?: string;
  message?: string;
};

/**
 * Check payment status for an order
 * GET /api/payment/status?order_id=xxx
 */
export async function GET(request: NextRequest): Promise<NextResponse<PaymentStatusResponse>> {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('order_id');

    if (!orderId) {
      return NextResponse.json({
        success: false,
        status: 'not_found',
        message: 'Missing order_id parameter',
      }, { status: 400 });
    }

    const supabase = getSupabase();

    const { data: order, error } = await supabase
      .from('orders')
      .select('id, status, payment_status')
      .eq('id', orderId)
      .single();

    if (error || !order) {
      console.error('[Payment/Status] Order not found:', orderId, error);
      return NextResponse.json({
        success: false,
        status: 'not_found',
        message: 'Order not found',
      }, { status: 404 });
    }

    // Determine payment status
    let paymentStatus: 'pending' | 'confirmed' | 'failed' = 'pending';

    if (order.status === 'confirmed' || order.payment_status === 'approved') {
      paymentStatus = 'confirmed';
    } else if (
      order.payment_status === 'declined'
      || order.payment_status === 'error'
      || order.payment_status === 'amount_mismatch'
    ) {
      paymentStatus = 'failed';
    }
    // 'verification_pending' falls through to the 'pending' default - still waiting, not failed.

    return NextResponse.json({
      success: true,
      status: paymentStatus,
      orderId: order.id,
    });
  } catch (error) {
    console.error('[Payment/Status] Error:', error);
    return NextResponse.json({
      success: false,
      status: 'pending',
      message: 'Error checking status',
    }, { status: 500 });
  }
}
