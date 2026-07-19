import { NextRequest, NextResponse } from 'next/server';
import { parseCallbackData, verifyTransaction, verifyCallbackSignature } from '@/services/hyp.service';
import { createClient } from '@supabase/supabase-js';
import type { HypTransactionStatus } from '@/services/hyp.service';

// Create a Supabase client for server-side operations
function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceKey) {
    // CRITIQUE : sans service key, Supabase RLS bloque les UPDATE → commande reste pending
    console.error('[Payment/Callback] SUPABASE_SERVICE_ROLE_KEY manquante ! Les updates seront bloquées par RLS.');
  }
  const key = serviceKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error('Missing Supabase credentials');
  }

  return createClient(url, key);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Notify admins (via the existing web-push channel) that a payment needs manual attention.
 * Best-effort only: failures here must never block the callback response to Yaad.
 */
async function notifyAdminsPaymentIssue(orderId: string, title: string, body: string): Promise<void> {
  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.functions.invoke('send-push', {
      body: { orderId, title, body, requireInteraction: true },
    });
    if (error) {
      console.error('[Payment/Callback] Admin alert push failed:', error);
    }
  } catch (err) {
    console.error('[Payment/Callback] Admin alert push threw:', err);
  }
}

/**
 * Re-check the transaction with Yaad's own API, retrying once if the failure
 * looks transient (network error) rather than a definitive answer from the gateway.
 */
async function verifyWithRetry(transactionId: string): Promise<{
  verification: HypTransactionStatus;
  transientFailure: boolean;
}> {
  let verification = await verifyTransaction(transactionId);

  if (!verification.success && verification.errorCode === 'NETWORK_ERROR') {
    await sleep(500);
    verification = await verifyTransaction(transactionId);
  }

  const transientFailure = !verification.success && verification.errorCode === 'NETWORK_ERROR';
  return { verification, transientFailure };
}

/**
 * Handle IPN (Instant Payment Notification) callback from Hyp/Yaad Shrig.
 *
 * Yaad sends payment status updates to this endpoint. We:
 * 1. Reject anything without a valid signature (the signature covers Id/CCode/Amount/Order,
 *    so a valid signature already authenticates the core fields).
 * 2. Cross-check with Yaad's getTransInfo API for extra assurance, with one retry for
 *    transient network failures.
 * 3. Update the order's payment_status (and status, for approved payments) in the DB.
 */
async function processPaymentCallback(callbackData: Record<string, string>) {
  console.log('[Payment/Callback] Callback data received:', {
    transactionId: callbackData.tranId || callbackData.txId || callbackData.Id,
    orderId: callbackData.uniqueid || callbackData.Order,
    result: callbackData.result || callbackData.CCode,
  });

  // Signature is mandatory: an absent signature is no longer treated as "trust it anyway".
  const signature = callbackData.Sign || callbackData.sign || callbackData.signature;
  if (!signature || !verifyCallbackSignature(callbackData, signature)) {
    console.error('[Payment/Callback] Missing or invalid signature - rejecting callback');
    return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 403 });
  }

  // Signature-authenticated data (Id, CCode, Amount, Order, Fild1-3 are covered by the signature).
  const paymentStatus = parseCallbackData(callbackData);

  if (!paymentStatus.orderId && !paymentStatus.transactionId) {
    console.error('[Payment/Callback] No order or transaction ID in callback');
    return NextResponse.json(
      { success: false, error: 'Missing order or transaction ID' },
      { status: 400 }
    );
  }

  const orderId = paymentStatus.orderId;
  if (!orderId) {
    return NextResponse.json({ success: false, error: 'Missing order ID' }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  // Re-check with Yaad's own API as a second, independent confirmation.
  let verifiedStatus: HypTransactionStatus = paymentStatus;
  let transientVerificationFailure = false;

  if (paymentStatus.transactionId) {
    const { verification, transientFailure } = await verifyWithRetry(paymentStatus.transactionId);
    transientVerificationFailure = transientFailure;
    if (verification.success) {
      verifiedStatus = verification;
    }
  }

  if (transientVerificationFailure) {
    console.error('[Payment/Callback] Could not verify transaction with Yaad after retry:', paymentStatus.transactionId);
    await supabase
      .from('orders')
      .update({
        payment_status: 'verification_pending',
        payment_transaction_id: paymentStatus.transactionId,
        payment_updated_at: new Date().toISOString(),
      })
      .eq('id', orderId);

    await notifyAdminsPaymentIssue(
      orderId,
      'Vérification paiement échouée',
      `Commande #${orderId.slice(0, 8)} : impossible de vérifier le paiement auprès de Yaad, nouvelle tentative en cours.`
    );

    // Non-200 so Yaad's own IPN retry mechanism redelivers this callback later.
    return NextResponse.json(
      { success: false, error: 'Verification pending, please retry' },
      { status: 502 }
    );
  }

  // Check for duplicate callback or already confirmed order
  const { data: existingOrder } = await supabase
    .from('orders')
    .select('payment_transaction_id, status, total_amount')
    .eq('id', orderId)
    .single();

  // Vérification de doublon : seulement si les deux IDs sont non-null et identiques.
  if (
    existingOrder?.payment_transaction_id
    && verifiedStatus.transactionId
    && existingOrder.payment_transaction_id === verifiedStatus.transactionId
  ) {
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
      await supabase.from('orders').update({
        payment_status: 'amount_mismatch',
        payment_transaction_id: verifiedStatus.transactionId,
        payment_error_message: `Montant invalide: attendu ${expectedAmount}₪, payé ${paidAmount}₪`,
        payment_updated_at: new Date().toISOString(),
      }).eq('id', orderId);

      await notifyAdminsPaymentIssue(
        orderId,
        'Montant de paiement incorrect',
        `Commande #${orderId.slice(0, 8)} : attendu ${expectedAmount}₪, payé ${paidAmount}₪.`
      );

      return NextResponse.json({ success: false, error: 'Amount mismatch' });
    }
  }

  // Map status: only 'approved' moves the order forward. Declines/errors are recorded
  // on payment_status only - order.status stays 'pending' (it's a fact about the
  // payment, not a new order lifecycle stage; the order can still be confirmed later
  // via a manual/cash/WhatsApp flow).
  const updateData: Record<string, unknown> = {
    payment_transaction_id: verifiedStatus.transactionId,
    payment_auth_code: verifiedStatus.authCode,
    payment_card_mask: verifiedStatus.cardMask,
    payment_card_brand: verifiedStatus.cardBrand,
    payment_status: verifiedStatus.status,
    payment_updated_at: new Date().toISOString(),
  };

  if (verifiedStatus.status === 'approved') {
    updateData.status = 'confirmed';
  } else {
    updateData.payment_error_code = verifiedStatus.errorCode;
    updateData.payment_error_message = verifiedStatus.errorMessage;
  }

  const { error: updateError } = await supabase
    .from('orders')
    .update(updateData)
    .eq('id', orderId);

  if (updateError) {
    console.error('[Payment/Callback] Error updating order:', updateError);
    await notifyAdminsPaymentIssue(
      orderId,
      'Erreur mise à jour commande',
      `Commande #${orderId.slice(0, 8)} : le paiement a été traité mais la mise à jour en base a échoué. Vérification manuelle requise.`
    );
  } else {
    console.log(`[Payment/Callback] Order ${orderId} payment_status updated to: ${verifiedStatus.status}`);
  }

  if (verifiedStatus.status === 'declined' || verifiedStatus.status === 'error') {
    await notifyAdminsPaymentIssue(
      orderId,
      'Paiement refusé',
      `Commande #${orderId.slice(0, 8)} : paiement ${verifiedStatus.status === 'declined' ? 'refusé' : 'en erreur'}.`
    );
  }

  // Send confirmation email for approved payments
  if (verifiedStatus.status === 'approved') {
    sendPaymentConfirmationEmail(orderId).catch(console.error);
  }

  // Yaad expects a 200 response to confirm receipt (for all resolved outcomes).
  return NextResponse.json({
    success: true,
    received: true,
    orderId,
    status: verifiedStatus.status,
  });
}

export async function POST(request: NextRequest) {
  try {
    console.log('[Payment/Callback] Received IPN callback (POST)');

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
      const text = await request.text();
      const params = new URLSearchParams(text);
      params.forEach((value, key) => {
        callbackData[key] = value;
      });
    }

    return await processPaymentCallback(callbackData);
  } catch (error) {
    console.error('[Payment/Callback] Error processing callback:', error);
    // Return 200 anyway to prevent Yaad from retrying on our own bug
    return NextResponse.json({
      success: false,
      received: true,
      error: 'Processing error',
    });
  }
}

/**
 * Handle GET requests. Some Yaad terminal configurations deliver the IPN via GET
 * instead of POST - this now goes through the exact same verification path as POST
 * (signature required, gateway re-check, idempotency, amount check) instead of the
 * previous unauthenticated shortcut.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  if (searchParams.has('tranId') || searchParams.has('uniqueid') || searchParams.has('result') || searchParams.has('Order')) {
    const callbackData: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      callbackData[key] = value;
    });

    try {
      return await processPaymentCallback(callbackData);
    } catch (error) {
      console.error('[Payment/Callback] Error processing GET callback:', error);
      return NextResponse.json({ success: false, received: true, error: 'Processing error' });
    }
  }

  return NextResponse.json({
    success: true,
    message: 'Payment callback endpoint is active',
  });
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
