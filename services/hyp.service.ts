/**
 * Hyp/CreditGuard Payment Gateway Service
 *
 * Documentation:
 * - https://developers.hyp.co.il/
 * - https://www.creditguard.co.il/staticmedia/CG_Documents/CG-Gateway-Redirect-API.pdf
 *
 * This service handles communication with the CreditGuard payment gateway.
 * All API calls must be made server-side only.
 */

export interface HypPaymentRequest {
  orderId: string;
  amount: number; // In agorot (cents) - multiply by 100
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

// CreditGuard response codes
const RESPONSE_CODES: Record<string, string> = {
  '000': 'Transaction approved',
  '001': 'Card blocked',
  '002': 'Card stolen',
  '003': 'Contact credit company',
  '004': 'Transaction declined',
  '005': 'Forged card',
  '006': 'CVV error',
  '033': 'Card expired',
  '036': 'Card blocked',
  '039': 'Wrong card number',
};

/**
 * Build XML request for CreditGuard API
 */
function buildPaymentXML(request: HypPaymentRequest): string {
  const terminalId = process.env.HYP_TERMINAL_ID;
  const username = process.env.HYP_USERNAME;
  const password = process.env.HYP_PASSWORD;

  if (!terminalId || !username || !password) {
    throw new Error('Missing Hyp credentials in environment variables');
  }

  // Amount in agorot (multiply by 100)
  const amountInAgorot = Math.round(request.amount * 100);

  // Language mapping
  const langMap: Record<string, string> = { he: 'HEB', en: 'ENG', fr: 'ENG' };
  const language = langMap[request.language || 'he'] || 'HEB';

  // Build XML - using redirect/hosted payment page
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<ashrait>
  <request>
    <command>doDeal</command>
    <requestId>${Date.now()}</requestId>
    <version>2000</version>
    <language>${language}</language>
    <mayBeDuplicate>0</mayBeDuplicate>
    <doDeal>
      <terminalNumber>${terminalId}</terminalNumber>
      <cardNo>CGMPI</cardNo>
      <total>${amountInAgorot}</total>
      <transactionType>Debit</transactionType>
      <creditType>RegularCredit</creditType>
      <currency>ILS</currency>
      <transactionCode>Phone</transactionCode>
      <authNumber></authNumber>
      <numberOfPayments>1</numberOfPayments>
      <firstPayment></firstPayment>
      <periodicalPayment></periodicalPayment>
      <validation>TxnSetup</validation>
      <mid>${terminalId}</mid>
      <uniqueid>${request.orderId}</uniqueid>
      <mpiValidation>autoComm</mpiValidation>
      <email>${escapeXml(request.customer.email)}</email>
      <clientPhone>${escapeXml(request.customer.phone)}</clientPhone>
      <customerName>${escapeXml(request.customer.name)}</customerName>
      <description>${escapeXml(request.description)}</description>
      <user>${escapeXml(username)}</user>
      <successUrl>${escapeXml(request.successUrl)}</successUrl>
      <errorUrl>${escapeXml(request.cancelUrl)}</errorUrl>
      <cancelUrl>${escapeXml(request.cancelUrl)}</cancelUrl>
      <notifyUrl>${escapeXml(request.callbackUrl)}</notifyUrl>
    </doDeal>
  </request>
</ashrait>`;

  return xml;
}

/**
 * Escape special XML characters
 */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Parse XML response from CreditGuard
 */
function parseXmlValue(xml: string, tagName: string): string | undefined {
  const regex = new RegExp(`<${tagName}>([^<]*)</${tagName}>`, 'i');
  const match = xml.match(regex);
  return match ? match[1] : undefined;
}

/**
 * Create a hosted payment page with CreditGuard
 */
export async function createPaymentPage(
  request: HypPaymentRequest
): Promise<HypPaymentResponse> {
  const apiUrl = process.env.HYP_API_URL;
  const username = process.env.HYP_USERNAME;
  const password = process.env.HYP_PASSWORD;

  if (!apiUrl) {
    throw new Error('HYP_API_URL is not configured');
  }

  try {
    const xml = buildPaymentXML(request);

    console.log('[Hyp] Creating payment page for order:', request.orderId);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        user: username || '',
        password: password || '',
        int_in: xml,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const responseText = await response.text();
    console.log('[Hyp] Response received');

    // Parse response XML
    const cgGatewayUrl = parseXmlValue(responseText, 'mpiHostedPageUrl');
    const transactionId = parseXmlValue(responseText, 'tranId');
    const resultCode = parseXmlValue(responseText, 'result');
    const errorMessage = parseXmlValue(responseText, 'message');
    const userMessage = parseXmlValue(responseText, 'userMessage');

    // Check for success
    if (resultCode === '000' && cgGatewayUrl) {
      return {
        success: true,
        paymentPageUrl: cgGatewayUrl,
        transactionId: transactionId,
      };
    }

    // Handle error
    return {
      success: false,
      errorCode: resultCode,
      errorMessage: userMessage || errorMessage || RESPONSE_CODES[resultCode || ''] || 'Payment initialization failed',
    };
  } catch (error) {
    console.error('[Hyp] Error creating payment page:', error);
    return {
      success: false,
      errorCode: 'NETWORK_ERROR',
      errorMessage: error instanceof Error ? error.message : 'Network error',
    };
  }
}

/**
 * Verify a transaction status (for callback/IPN verification)
 */
export async function verifyTransaction(
  transactionId: string
): Promise<HypTransactionStatus> {
  const apiUrl = process.env.HYP_API_URL;
  const terminalId = process.env.HYP_TERMINAL_ID;
  const username = process.env.HYP_USERNAME;
  const password = process.env.HYP_PASSWORD;

  if (!apiUrl || !terminalId || !username || !password) {
    throw new Error('Missing Hyp credentials');
  }

  try {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<ashrait>
  <request>
    <command>inquireTransactions</command>
    <requestId>${Date.now()}</requestId>
    <version>2000</version>
    <language>HEB</language>
    <inquireTransactions>
      <terminalNumber>${terminalId}</terminalNumber>
      <mainTerminalNumber></mainTerminalNumber>
      <queryName>mpiTransaction</queryName>
      <mid>${terminalId}</mid>
      <tranId>${transactionId}</tranId>
      <user>${escapeXml(username)}</user>
    </inquireTransactions>
  </request>
</ashrait>`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        user: username,
        password: password,
        int_in: xml,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const responseText = await response.text();

    // Parse response
    const resultCode = parseXmlValue(responseText, 'result');
    const status = parseXmlValue(responseText, 'status');
    const authCode = parseXmlValue(responseText, 'authNumber');
    const cardMask = parseXmlValue(responseText, 'cardMask');
    const cardBrand = parseXmlValue(responseText, 'cardName');
    const orderId = parseXmlValue(responseText, 'uniqueid');
    const amount = parseXmlValue(responseText, 'total');

    if (resultCode === '000') {
      // Map CreditGuard status to our status
      let mappedStatus: HypTransactionStatus['status'] = 'pending';
      if (status === 'approved' || status === '000') {
        mappedStatus = 'approved';
      } else if (status === 'declined' || (status && status !== '000')) {
        mappedStatus = 'declined';
      }

      return {
        success: true,
        transactionId,
        orderId,
        amount: amount ? parseInt(amount) / 100 : undefined,
        status: mappedStatus,
        authCode,
        cardMask,
        cardBrand,
      };
    }

    return {
      success: false,
      transactionId,
      status: 'error',
      errorCode: resultCode,
      errorMessage: parseXmlValue(responseText, 'message') || 'Verification failed',
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
 * Parse callback/IPN data from CreditGuard
 * CreditGuard sends data as form-urlencoded or in the response parameter
 */
export function parseCallbackData(data: Record<string, string>): HypTransactionStatus {
  // CreditGuard can send data in different formats
  const transactionId = data.tranId || data.txId || data.transactionId;
  const orderId = data.uniqueid || data.orderId;
  const resultCode = data.result || data.statusCode;
  const authCode = data.authNumber || data.authCode;
  const amount = data.total || data.amount;
  const cardMask = data.cardMask || data.last4;
  const cardBrand = data.cardName || data.cardBrand;

  // Check if transaction was approved
  const isApproved = resultCode === '000' || resultCode === 'approved';

  let status: HypTransactionStatus['status'] = 'pending';
  if (isApproved) {
    status = 'approved';
  } else if (resultCode === 'cancelled' || resultCode === 'cancel') {
    status = 'declined';
  } else if (resultCode) {
    status = 'declined';
  }

  return {
    success: isApproved,
    transactionId,
    orderId,
    amount: amount ? parseInt(amount) / 100 : undefined,
    status,
    authCode,
    cardMask,
    cardBrand,
    errorCode: isApproved ? undefined : resultCode,
    errorMessage: isApproved ? undefined : (data.message || data.errorMessage || RESPONSE_CODES[resultCode] || 'Transaction failed'),
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
