/**
 * Payment Service
 *
 * Handles payment initiation via Hyp/CreditGuard gateway.
 * This service calls the backend API endpoints which communicate
 * with the CreditGuard API.
 */

export interface PaymentItem {
  name: string;
  quantity: number;
  price: number;
}

export interface PaymentRequest {
  orderId: string;
  amount: number;
  currency: 'ILS';
  items: PaymentItem[];
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  deliveryMethod: 'pickup' | 'delivery';
  deliveryAddress?: {
    street: string;
    city: string;
    postalCode: string;
  };
  successUrl: string;
  failureUrl: string;
  callbackUrl: string;
  language?: 'he' | 'en' | 'fr';
}

export interface PaymentResponse {
  success: boolean;
  paymentUrl?: string;
  transactionId?: string;
  error?: string;
  errorCode?: string;
}

/**
 * Initiates a payment via the Hyp/CreditGuard gateway
 * Calls the backend /api/payment/initiate endpoint
 */
export async function initiatePayment(request: PaymentRequest): Promise<PaymentResponse> {
  try {
    // Build description from items
    const description = request.items
      .map(item => `${item.name} x${item.quantity}`)
      .join(', ')
      .slice(0, 100); // CreditGuard has a limit on description length

    const response = await fetch('/api/payment/initiate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId: request.orderId,
        amount: request.amount,
        currency: request.currency,
        description: description || `Order ${request.orderId}`,
        customer: {
          name: request.customer.name,
          email: request.customer.email,
          phone: request.customer.phone,
        },
        successUrl: request.successUrl,
        cancelUrl: request.failureUrl,
        callbackUrl: request.callbackUrl,
        language: request.language || 'fr',
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Payment initiation failed',
        errorCode: data.errorCode,
      };
    }

    return {
      success: data.success,
      paymentUrl: data.paymentUrl,
      transactionId: data.transactionId,
      error: data.error,
    };
  } catch (error) {
    console.error('[Payment] Error initiating payment:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

/**
 * Verifies a payment callback from Hyp/CreditGuard
 * Parses URL parameters returned after payment
 */
export function parsePaymentCallback(searchParams: URLSearchParams): {
  transactionId?: string;
  orderId?: string;
  status?: 'approved' | 'declined' | 'cancelled' | 'pending';
  errorCode?: string;
  errorMessage?: string;
} {
  const result = searchParams.get('result') || searchParams.get('status');
  const transactionId = searchParams.get('tranId') || searchParams.get('txId');
  const orderId = searchParams.get('uniqueid') || searchParams.get('order_id');
  const errorMessage = searchParams.get('message') || searchParams.get('userMessage');

  // Map CreditGuard result codes to status
  let status: 'approved' | 'declined' | 'cancelled' | 'pending' = 'pending';
  if (result === '000' || result === 'approved') {
    status = 'approved';
  } else if (result === 'cancelled' || result === 'cancel') {
    status = 'cancelled';
  } else if (result) {
    status = 'declined';
  }

  return {
    transactionId: transactionId || undefined,
    orderId: orderId || undefined,
    status,
    errorCode: result !== '000' ? result || undefined : undefined,
    errorMessage: status !== 'approved' ? errorMessage || undefined : undefined,
  };
}

/**
 * Check payment status for an order
 * Calls backend API to verify transaction status
 */
export async function checkPaymentStatus(orderId: string): Promise<{
  success: boolean;
  status?: 'pending' | 'confirmed' | 'failed';
  error?: string;
}> {
  try {
    const response = await fetch(`/api/payment/status?order_id=${encodeURIComponent(orderId)}`);

    if (!response.ok) {
      return {
        success: false,
        error: 'Failed to check payment status',
      };
    }

    const data = await response.json();
    return {
      success: true,
      status: data.status,
    };
  } catch (error) {
    console.error('[Payment] Error checking status:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}
