import { NextRequest, NextResponse } from 'next/server';
import { createSignedPaymentUrl, type HypPaymentRequest } from '@/services/hyp.service';

export interface InitiatePaymentBody {
  orderId: string;
  amount: number;
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

export async function POST(request: NextRequest) {
  try {
    const body: InitiatePaymentBody = await request.json();

    // Validate required fields
    if (!body.orderId || !body.amount || !body.customer) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!body.customer.name || !body.customer.email || !body.customer.phone) {
      return NextResponse.json(
        { success: false, error: 'Missing customer information' },
        { status: 400 }
      );
    }

    // Build payment request
    const paymentRequest: HypPaymentRequest = {
      orderId: body.orderId,
      amount: body.amount,
      currency: body.currency || 'ILS',
      description: body.description || `Order ${body.orderId}`,
      customer: body.customer,
      successUrl: body.successUrl,
      cancelUrl: body.cancelUrl,
      callbackUrl: body.callbackUrl,
      language: body.language,
    };

    console.log('[Payment/Initiate] Creating payment for order:', body.orderId);

    // Call Hyp API to create payment page
    const result = await createSignedPaymentUrl(paymentRequest);

    if (result.success && result.paymentPageUrl) {
      console.log('[Payment/Initiate] Payment page created successfully');
      return NextResponse.json({
        success: true,
        paymentUrl: result.paymentPageUrl,
        transactionId: result.transactionId,
      });
    }

    console.error('[Payment/Initiate] Failed to create payment page:', result.errorMessage);
    return NextResponse.json(
      {
        success: false,
        error: result.errorMessage || 'Failed to initialize payment',
        errorCode: result.errorCode,
      },
      { status: 400 }
    );
  } catch (error) {
    console.error('[Payment/Initiate] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
