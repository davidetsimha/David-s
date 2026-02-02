/**
 * Hyp/Yaad Shrig Payment Gateway Service
 *
 * Uses the simple URL-based API instead of CreditGuard XML API.
 * Documentation: https://yaadpay.docs.apiary.io/
 *
 * This service handles communication with the Yaad Shrig payment gateway.
 */

export interface HypPaymentRequest {
  orderId: string;
  amount: number; // In ILS (shekels)
  currency: 'ILS';
  description: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  successUrl: string;
  cancelUrl: string;
  callbackUrl: string;
  language?: 'he' | 'en' | 'fr';
}

export interface HypPaymentResponse {
  success: boolean;
  paymentPageUrl?: string;
  transactionId?: string;
  errorCode?: string;
  errorMessage?: string;
}

export interface HypTransactionStatus {
  success: boolean;
  transactionId?: string;
  orderId?: string;
  amount?: number;
  status?: 'approved' | 'declined' | 'pending' | 'error';
  authCode?: string;
  cardMask?: string;
  cardBrand?: string;
  errorCode?: string;
  errorMessage?: string;
}

// Yaad Shrig API base URL
const YAAD_API_URL = 'https://icom.yaad.net/p/';

/**
 * Create a payment page URL for Yaad Shrig
 * This uses the simple redirect-based API
 */
export async function createPaymentPage(
  request: HypPaymentRequest
): Promise<HypPaymentResponse> {
  const masof = process.env.HYP_TERMINAL_ID;
  const passP = process.env.HYP_API_KEY;

  if (!masof || !passP) {
    throw new Error('Missing Hyp credentials in environment variables');
  }

  try {
    // Build the payment page URL with parameters
    const params = new URLSearchParams();

    // Required parameters
    params.append('action', 'pay');
    params.append('Masof', masof);
    params.append('PassP', passP);
    params.append('Amount', request.amount.toFixed(2));
    params.append('Currency', '1'); // 1 = ILS
    params.append('Order', request.orderId);
    params.append('Info', request.description.slice(0, 50)); // Max 50 chars

    // Customer info
    params.append('ClientName', request.customer.name);
    params.append('ClientLName', ''); // Last name (optional, included in name)
    params.append('email', request.customer.email);
    params.append('phone', request.customer.phone);

    // Redirect URLs
    params.append('SuccessURL', request.successUrl);
    params.append('ErrorURL', request.cancelUrl);
    params.append('CancelURL', request.cancelUrl);

    // Callback/IPN URL (NotifyURL)
    params.append('NotifyURL', request.callbackUrl);

    // Transaction settings
    params.append('J5', 'False'); // J5=False means one-time payment (not token)
    params.append('Coin', '1'); // 1 = ILS
    params.append('Tash', '1'); // Number of payments (1 = single payment)
    params.append('FixTash', 'False'); // Allow customer to change number of payments
    params.append('Sign', 'True'); // Enable signature verification
    params.append('UTF8', 'True'); // UTF-8 encoding
    params.append('UTF8out', 'True'); // UTF-8 output

    // Language
    const langMap: Record<string, string> = { he: 'HEB', en: 'ENG', fr: 'ENG' };
    params.append('PageLang', langMap[request.language || 'he'] || 'HEB');

    // Build the full payment page URL
    const paymentUrl = `${YAAD_API_URL}?${params.toString()}`;

    console.log('[Hyp] Payment page URL created for order:', request.orderId);

    return {
      success: true,
      paymentPageUrl: paymentUrl,
      transactionId: request.orderId,
    };
  } catch (error) {
    console.error('[Hyp] Error creating payment page:', error);
    return {
      success: false,
      errorCode: 'BUILD_ERROR',
      errorMessage: error instanceof Error ? error.message : 'Failed to create payment URL',
    };
  }
}

/**
 * Verify transaction status using Yaad API
 */
export async function verifyTransaction(
  transactionId: string
): Promise<HypTransactionStatus> {
  const masof = process.env.HYP_TERMINAL_ID;
  const passP = process.env.HYP_API_KEY;

  if (!masof || !passP) {
    throw new Error('Missing Hyp credentials');
  }

  try {
    const params = new URLSearchParams();
    params.append('action', 'getTransInfo');
    params.append('Masof', masof);
    params.append('PassP', passP);
    params.append('TransId', transactionId);

    const response = await fetch(`${YAAD_API_URL}?${params.toString()}`);
    const text = await response.text();

    // Parse response (format: key=value&key=value)
    const result = parseYaadResponse(text);

    if (result.CCode === '0') {
      return {
        success: true,
        transactionId: result.Id || transactionId,
        orderId: result.Order,
        amount: result.Amount ? parseFloat(result.Amount) : undefined,
        status: 'approved',
        authCode: result.ACode,
        cardMask: result.L4digit,
        cardBrand: result.Brand,
      };
    }

    return {
      success: false,
      transactionId,
      status: 'error',
      errorCode: result.CCode,
      errorMessage: result.Err || 'Verification failed',
    };
  } catch (error) {
    console.error('[Hyp] Error verifying transaction:', error);
    return {
      success: false,
      transactionId,
      status: 'error',
      errorCode: 'NETWORK_ERROR',
      errorMessage: error instanceof Error ? error.message : 'Network error',
    };
  }
}

/**
 * Parse Yaad Shrig response (key=value&key=value format)
 */
function parseYaadResponse(response: string): Record<string, string> {
  const result: Record<string, string> = {};
  const pairs = response.split('&');

  for (const pair of pairs) {
    const [key, value] = pair.split('=');
    if (key && value !== undefined) {
      result[decodeURIComponent(key)] = decodeURIComponent(value);
    }
  }

  return result;
}

/**
 * Parse callback/IPN data from Yaad Shrig
 * Yaad sends data as query parameters or form data
 */
export function parseCallbackData(data: Record<string, string>): HypTransactionStatus {
  // Yaad Shrig callback parameters
  const transactionId = data.Id || data.TransId || data.trans_id;
  const orderId = data.Order || data.order;
  const ccode = data.CCode || data.ccode || data.code;
  const amount = data.Amount || data.amount;
  const authCode = data.ACode || data.Acode || data.acode;
  const cardMask = data.L4digit || data.l4digit || data.last4;
  const cardBrand = data.Brand || data.brand || data.cardType;
  const errorMessage = data.Err || data.err || data.errMsg;

  // CCode = 0 means success
  const isApproved = ccode === '0';

  let status: HypTransactionStatus['status'] = 'pending';
  if (isApproved) {
    status = 'approved';
  } else if (ccode) {
    status = 'declined';
  }

  return {
    success: isApproved,
    transactionId,
    orderId,
    amount: amount ? parseFloat(amount) : undefined,
    status,
    authCode,
    cardMask,
    cardBrand,
    errorCode: isApproved ? undefined : ccode,
    errorMessage: isApproved ? undefined : errorMessage,
  };
}

/**
 * Parse callback data from URL query parameters (for success/cancel redirects)
 */
export function parseRedirectParams(searchParams: URLSearchParams): HypTransactionStatus {
  const data: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    data[key] = value;
  });
  return parseCallbackData(data);
}
