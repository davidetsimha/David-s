import { NextRequest, NextResponse } from 'next/server';
import { parseCallbackData, verifyTransaction, verifyCallbackSignature } from '@/services/hyp.service';
import { createClient } from '@supabase/supabase-js';

// Create a Supabase client for server-side operations
function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Fall back to anon key if service key not available
  const key = serviceKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error('Missing Supabase credentials');
  }

  return createClient(url, key);
}

/**
 * Handle IPN (Instant Payment Notification) callback from Hyp/CreditGuard
 *
 * CreditGuard sends payment status updates to this endpoint.
 * We need to:
 * 1. Parse the callback data
 * 2. Verify the transaction with CreditGuard API
 * 3. Update the order status in our database
 */
export async function POST(request: NextRequest) {
  try {
    console.log('[Payment/Callback] Received IPN callback');

    // Parse the incoming data (can be form-urlencoded or JSON)
    const contentType = request.headers.get('content-type') || '';
    let callbackData: Record<string, string> = {};

    if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await request.formData();
      formData.forEach((value, key) => {
        callbackData[key] = value.toString();
      });
    } else if (contentType.includes('application/json')) {
      const jsonData = await request.json();
      callbackData = jsonData;
    } else {
      // Try to parse as form data by default
      const text = await request.text();
      const params = new URLSearchParams(text);
      params.forEach((value, key) => {
        callbackData[key] = value;
      });
    }

    console.log('[Payment/Callback] Callback data received:', {
      transactionId: callbackData.tranId || callbackData.txId,
      orderId: callbackData.uniqueid,
      result: callbackData.result,
    });

    // Verify signature if present
    const signature = callbackData.Sign || callbackData.sign || callbackData.signature;
    if (signature && !verifyCallbackSignature(callbackData, signature)) {
      console.error('[Payment/Callback] Invalid signature');
      return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 403 });
    }

    // Parse the callback data
    const paymentStatus = parseCallbackData(callbackData);

    if (!paymentStatus.orderId && !paymentStatus.transactionId) {
      console.error('[Payment/Callback] No order or transaction ID in callback');
      return NextResponse.json(
        { success: false, error: 'Missing order or transaction ID' },
        { status: 400 }
      );
    }

    // Optionally verify with CreditGuard API for extra security
    let verifiedStatus = paymentStatus;
    if (paymentStatus.transactionId) {
      try {
        const verification = await verifyTransaction(paymentStatus.transactionId);
        if (verification.success) {
          verifiedStatus = verification;
          console.log('[Payment/Callback] Transaction verified:', verification.status);
        }
      } catch (verifyError) {
        // Log but continue - callback data should be sufficient
        console.warn('[Payment/Callback] Could not verify transaction:', verifyError);
      }
    }

    // Update order status in database
    const supabase = getSupabaseAdmin();
    const orderId = verifiedStatus.orderId || paymentStatus.orderId;

    if (orderId) {
      // Check for duplicate callback or already confirmed order
      const { data: existingOrder } = await supabase
        .from('orders')
        .select('payment_transaction_id, status, total_amount')
        .eq('id', orderId)
        .single();

      if (existingOrder?.payment_transaction_id === verifiedStatus.transactionId) {
        console.log('[Payment/Callback] Callback already processed, ignoring');
        return NextResponse.json({ success: true, message: 'Already processed' });
      }

      // Don't re-update an already confirmed order
      if (existingOrder?.status === 'confirmed') {
        console.log('[Payment/Callback] Order already confirmed, ignoring');
        return NextResponse.json({ success: true, message: 'Already confirmed' });
      }

      // Verify that the paid amount matches the expected amount
      if (existingOrder && verifiedStatus.amount) {
        const expectedAmount = Number(existingOrder.total_amount);
        const paidAmount = Number(verifiedStatus.amount);

        // 0.01 tolerance for rounding
        if (Math.abs(expectedAmount - paidAmount) > 0.01) {
          console.error(`[Payment/Callback] Amount mismatch: expected ${expectedAmount}, received ${paidAmount}`);
          // Mark as suspect but don't confirm
          await supabase.from('orders').update({
            payment_status: 'amount_mismatch',
            payment_error_message: `Montant invalide: attendu ${expectedAmount}₪, payé ${paidAmount}₪`,
          }).eq('id', orderId);
          return NextResponse.json({ success: false, error: 'Amount mismatch' });
        }
      }

      // Map status properly
      let newStatus: string;
      if (verifiedStatus.status === 'approved') {
        newStatus = 'confirmed';
      } else if (verifiedStatus.status === 'declined' || verifiedStatus.status === 'error') {
        newStatus = 'payment_failed';
      } else {
        newStatus = 'pending';
      }

      const updateData: Record<string, unknown> = {
        status: newStatus,
        payment_transaction_id: verifiedStatus.transactionId,
        payment_auth_code: verifiedStatus.authCode,
        payment_card_mask: verifiedStatus.cardMask,
        payment_card_brand: verifiedStatus.cardBrand,
        payment_status: verifiedStatus.status,
        payment_updated_at: new Date().toISOString(),
      };

      if (verifiedStatus.status !== 'approved') {
        updateData.payment_error_code = verifiedStatus.errorCode;
        updateData.payment_error_message = verifiedStatus.errorMessage;
      }

      const { error: updateError } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId);

      if (updateError) {
        console.error('[Payment/Callback] Error updating order:', updateError);
        // Don't fail - CreditGuard expects 200 response
      } else {
        console.log(`[Payment/Callback] Order ${orderId} updated to status: ${newStatus}`);
      }

      // Send confirmation email for approved payments
      if (verifiedStatus.status === 'approved') {
        // Trigger email notification (async, don't wait)
        sendPaymentConfirmationEmail(orderId).catch(console.error);
      }
    }

    // CreditGuard expects a 200 response to confirm receipt
    return NextResponse.json({
      success: true,
      received: true,
      orderId,
      status: verifiedStatus.status,
    });
  } catch (error) {
    console.error('[Payment/Callback] Error processing callback:', error);
    // Return 200 anyway to prevent CreditGuard from retrying
    return NextResponse.json({
      success: false,
      received: true,
      error: 'Processing error',
    });
  }
}

/**
 * Handle GET requests (for testing or status checks)
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // If there are callback parameters, process them
  if (searchParams.has('tranId') || searchParams.has('uniqueid') || searchParams.has('result')) {
    const callbackData: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      callbackData[key] = value;
    });

    // Convert to POST handler
    const response = await handleCallbackData(callbackData);
    return response;
  }

  return NextResponse.json({
    success: true,
    message: 'Payment callback endpoint is active',
  });
}

async function handleCallbackData(callbackData: Record<string, string>) {
  try {
    const paymentStatus = parseCallbackData(callbackData);
    const orderId = paymentStatus.orderId;

    if (orderId) {
      const supabase = getSupabaseAdmin();
      const newStatus = paymentStatus.status === 'approved' ? 'confirmed' : 'pending';

      await supabase
        .from('orders')
        .update({
          status: newStatus,
          payment_transaction_id: paymentStatus.transactionId,
          payment_status: paymentStatus.status,
          payment_updated_at: new Date().toISOString(),
        })
        .eq('id', orderId);
    }

    return NextResponse.json({
      success: true,
      received: true,
      orderId,
      status: paymentStatus.status,
    });
  } catch {
    return NextResponse.json({
      success: false,
      received: true,
    });
  }
}

/**
 * Send payment confirmation email
 * This is a placeholder - implement with your email service
 */
async function sendPaymentConfirmationEmail(orderId: string): Promise<void> {
  try {
    const supabase = getSupabaseAdmin();

    // Get order details
    const { data: order } = await supabase
      .from('orders')
      .select('*, items:order_items(*)')
      .eq('id', orderId)
      .single();

    if (!order) {
      console.warn('[Payment/Callback] Order not found for email:', orderId);
      return;
    }

    // TODO: Implement email sending using your preferred service
    // e.g., Resend, SendGrid, etc.
    console.log('[Payment/Callback] Payment confirmation email would be sent to:', order.customer_email);

    // Example with Supabase Edge Function:
    // await supabase.functions.invoke('send-email', {
    //   body: {
    //     type: 'payment_confirmation',
    //     orderId,
    //     customerEmail: order.customer_email,
    //     customerName: order.customer_name,
    //     totalAmount: order.total_amount,
    //   },
    // });
  } catch (error) {
    console.error('[Payment/Callback] Error sending confirmation email:', error);
  }
}
