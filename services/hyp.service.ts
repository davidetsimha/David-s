/**
 * Hyp/Yaad Shrig Payment Gateway Service
 *
 * Uses the simple URL-based API instead of CreditGuard XML API.
 * Documentation: https://yaadpay.docs.apiary.io/
 *
 * This service handles communication with the Yaad Shrig payment gateway.
 */

import crypto from 'crypto';

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
 * Verify the signature of a Hyp callback
 * Yaad Shrig uses an MD5 hash of certain parameters + PassP
 */
export function verifyCallbackSignature(
  data: Record<string, string>,
  signature: string
): boolean {
  const passP = process.env.HYP_API_KEY;
  if (!passP) return false;

  // Yaad Shrig uses a hash of certain parameters + PassP
  const params = ['Id', 'CCode', 'Amount', 'Order', 'Fild1', 'Fild2', 'Fild3'];
  const values = params.map(p => data[p] || '').join('');
  const expectedSignature = crypto
    .createHash('md5')
    .update(values + passP)
    .digest('hex');

  return signature === expectedSignature;
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
 * Create a SIGNED payment URL using Yaad APISign flow
 * This is more secure as PassP is never exposed to the client
 */
export async function createSignedPaymentUrl(
  request: HypPaymentRequest
): Promise<HypPaymentResponse> {
  const masof = process.env.HYP_TERMINAL_ID;
  const passP = process.env.HYP_API_KEY;

  if (!masof || !passP) {
    throw new Error('Missing Hyp credentials');
  }

  try {
    // Language mapping for Yaad Shrig
    const langMap: Record<string, string> = { he: 'HEB', en: 'ENG', fr: 'HEB' };

    // Step 1: Build params for signature request
    const signParams = new URLSearchParams();
    signParams.append('action', 'APISign');
    signParams.append('What', 'SIGN');
    signParams.append('KEY', passP);
    signParams.append('Masof', masof);
    signParams.append('PassP', passP);
    signParams.append('Amount', request.amount.toFixed(2));
    signParams.append('Currency', '1'); // ILS
    signParams.append('Order', request.orderId);
    signParams.append('Info', request.description.slice(0, 50));
    signParams.append('ClientName', request.customer.name);
    signParams.append('email', request.customer.email);
    signParams.append('phone', request.customer.phone);
    signParams.append('SuccessURL', request.successUrl);
    signParams.append('ErrorURL', request.cancelUrl);
    signParams.append('CancelURL', request.cancelUrl);
    signParams.append('NotifyURL', request.callbackUrl);
    signParams.append('J5', 'False');
    signParams.append('Coin', '1');
    signParams.append('Tash', '1');
    signParams.append('Sign', 'True');
    signParams.append('UTF8', 'True');
    signParams.append('UTF8out', 'True');
    signParams.append('PageLang', langMap[request.language || 'he'] || 'HEB');

    // Step 2: Call Yaad API to get signature
    const signResponse = await fetch(`${YAAD_API_URL}?${signParams.toString()}`);
    const signText = await signResponse.text();
    const signResult = parseYaadResponse(signText);

    if (signResult.CCode !== '0' || !signResult.signature) {
      console.error('[Hyp] APISign failed:', signResult);
      return {
        success: false,
        errorCode: signResult.CCode || 'SIGN_ERROR',
        errorMessage: signResult.Err || 'Failed to generate signature',
      };
    }

    // Step 3: Build client URL WITHOUT PassP, WITH signature
    const clientParams = new URLSearchParams();
    clientParams.append('action', 'pay');
    clientParams.append('Masof', masof);
    // NO PassP here!
    clientParams.append('Amount', request.amount.toFixed(2));
    clientParams.append('Currency', '1');
    clientParams.append('Order', request.orderId);
    clientParams.append('Info', request.description.slice(0, 50));
    clientParams.append('ClientName', request.customer.name);
    clientParams.append('email', request.customer.email);
    clientParams.append('phone', request.customer.phone);
    clientParams.append('SuccessURL', request.successUrl);
    clientParams.append('ErrorURL', request.cancelUrl);
    clientParams.append('CancelURL', request.cancelUrl);
    clientParams.append('NotifyURL', request.callbackUrl);
    clientParams.append('J5', 'False');
    clientParams.append('Coin', '1');
    clientParams.append('Tash', '1');
    clientParams.append('Sign', 'True');
    clientParams.append('UTF8', 'True');
    clientParams.append('UTF8out', 'True');
    clientParams.append('PageLang', langMap[request.language || 'he'] || 'HEB');
    clientParams.append('signature', signResult.signature);

    const paymentUrl = `${YAAD_API_URL}?${clientParams.toString()}`;

    console.log('[Hyp] Signed payment URL created for order:', request.orderId);

    return {
      success: true,
      paymentPageUrl: paymentUrl,
      transactionId: request.orderId,
    };
  } catch (error) {
    console.error('[Hyp] Error creating signed payment URL:', error);
    return {
      success: false,
      errorCode: 'BUILD_ERROR',
      errorMessage: error instanceof Error ? error.message : 'Failed to create payment URL',
    };
  }
}

/**
 * Create a payment page URL for Yaad Shrig
 * Uses direct URL approach (simpler, works with all terminals)
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
    const langMap: Record<string, string> = { he: 'HEB', en: 'ENG', fr: 'HEB' };

    // Build the payment page URL with parameters
    const params = new URLSearchParams();
    params.append('action', 'pay');
    params.append('Masof', masof);
    params.append('PassP', passP);
    params.append('Amount', request.amount.toFixed(2));
    params.append('Currency', '1'); // 1 = ILS
    params.append('Order', request.orderId);
    params.append('Info', request.description.slice(0, 50));
    params.append('ClientName', request.customer.name);
    params.append('email', request.customer.email);
    params.append('phone', request.customer.phone);
    params.append('SuccessURL', request.successUrl);
    params.append('ErrorURL', request.cancelUrl);
    params.append('CancelURL', request.cancelUrl);
    params.append('NotifyURL', request.callbackUrl);
    params.append('J5', 'False');
    params.append('Coin', '1');
    params.append('Tash', '1');
    params.append('Sign', 'True');
    params.append('MoreData', 'True');
    params.append('UTF8', 'True');
    params.append('UTF8out', 'True');
    params.append('PageLang', langMap[request.language || 'he'] || 'HEB');

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
