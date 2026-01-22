/**
 * PayPlus Payment Service
 *
 * Documentation: https://docs.payplus.co.il/reference/introduction
 *
 * IMPORTANT: All API requests must be made server-side.
 * This service prepares the data for a backend endpoint that will
 * communicate with PayPlus API.
 *
 * Required environment variables (for backend):
 * - PAYPLUS_API_KEY
 * - PAYPLUS_SECRET_KEY
 * - PAYPLUS_PAYMENT_PAGE_UID
 */

export interface PaymentItem {
  name: string;
  quantity: number;
  price: number;
}

export interface PaymentRequest {
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
}

export interface PaymentResponse {
  success: boolean;
  paymentUrl?: string;
  transactionId?: string;
  error?: string;
}

/**
 * Initiates a payment with PayPlus
 * In production, this should call your backend which then calls PayPlus API
 */
export async function initiatePayment(request: PaymentRequest): Promise<PaymentResponse> {
  // Mode test: si pas d'API configurée ou en développement, simuler le succès
  if (!process.env.NEXT_PUBLIC_PAYMENT_API_URL || process.env.NODE_ENV === 'development') {
    console.info('Mode test active: paiement simule');
    return {
      success: true,
      paymentUrl: undefined,
      transactionId: `test_${Date.now()}`,
    };
  }

  const backendUrl = process.env.NEXT_PUBLIC_PAYMENT_API_URL;

  try {
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        payment_page_uid: process.env.NEXT_PUBLIC_PAYPLUS_PAGE_UID,
        charge_method: 1, // 1 = Charge
        amount: request.amount,
        currency_code: request.currency,
        refURL_success: request.successUrl,
        refURL_failure: request.failureUrl,
        refURL_callback: request.callbackUrl,
        customer: {
          customer_name: request.customer.name,
          email: request.customer.email,
          phone: request.customer.phone,
        },
        items: request.items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        more_info: JSON.stringify({
          deliveryMethod: request.deliveryMethod,
          deliveryAddress: request.deliveryAddress,
        }),
      }),
    });

    if (!response.ok) {
      throw new Error('Payment initiation failed');
    }

    const data = await response.json();

    return {
      success: true,
      paymentUrl: data.data?.payment_page_link,
      transactionId: data.data?.transaction_uid,
    };
  } catch (error) {
    console.error('Payment error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Payment failed',
    };
  }
}

/**
 * Verifies a payment callback from PayPlus
 * Should be called on the success/callback page
 */
export function parsePaymentCallback(searchParams: URLSearchParams): {
  transactionId?: string;
  status?: string;
  amount?: number;
} {
  return {
    transactionId: searchParams.get('transaction_uid') || undefined,
    status: searchParams.get('status') || undefined,
    amount: searchParams.get('amount') ? parseFloat(searchParams.get('amount')!) : undefined,
  };
}
