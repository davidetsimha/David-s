'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { CheckCircle, ArrowRight, ArrowLeft, Phone, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useCartStore } from '@/stores';

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '058-781-9457';
const POLLING_INTERVAL = 5000; // 5 seconds
const POLLING_TIMEOUT = 120000; // 2 minutes

type PaymentStatus = 'pending' | 'confirmed' | 'failed' | 'loading';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const locale = useLocale();
  const t = useTranslations();
  const { clearCart } = useCartStore();

  const orderId = searchParams.get('order_id');
  const type = searchParams.get('type');
  const paymentPending = searchParams.get('payment_pending');
  const result = searchParams.get('result');

  const isRTL = locale === 'he';
  const direction = isRTL ? 'rtl' : 'ltr';
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  const isPlateauOrder = type === 'plateau';

  // Determine initial payment status from URL params
  const paymentApproved = result === '000';
  const paymentDeclined = result && result !== '000';

  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(() => {
    if (isPlateauOrder || paymentApproved) return 'confirmed';
    if (paymentDeclined) return 'failed';
    if (paymentPending) return 'pending';
    return 'loading';
  });
  const [cartCleared, setCartCleared] = useState(false);
  const [pollingTimedOut, setPollingTimedOut] = useState(false);
  const [orderDetails, setOrderDetails] = useState<{ totalAmount?: number } | null>(null);

  // Check payment status from API
  const checkPaymentStatus = useCallback(async () => {
    if (!orderId) return;

    try {
      const response = await fetch(`/api/payment/status?order_id=${orderId}`);
      const data = await response.json();

      if (data.success) {
        setPaymentStatus(data.status);
        return data.status;
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
    }
    return null;
  }, [orderId]);

  // Clear cart when payment is confirmed
  useEffect(() => {
    if (paymentStatus === 'confirmed' && !cartCleared) {
      clearCart();
      setCartCleared(true);
      // Clear pending order from sessionStorage
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('pendingOrderId');
      }
    }
  }, [paymentStatus, cartCleared, clearCart]);

  // Polling for pending payments
  useEffect(() => {
    // Don't poll if already confirmed, failed, or plateau order
    if (paymentStatus !== 'pending' && paymentStatus !== 'loading') return;
    if (isPlateauOrder) {
      setPaymentStatus('confirmed');
      return;
    }

    let pollCount = 0;
    let timeoutId: NodeJS.Timeout | null = null;
    let isCancelled = false;
    const maxPolls = POLLING_TIMEOUT / POLLING_INTERVAL;

    const poll = async () => {
      if (isCancelled) return;

      const status = await checkPaymentStatus();
      pollCount++;

      if (isCancelled) return;

      if (status === 'confirmed' || status === 'failed') {
        return; // Stop polling
      }

      if (pollCount >= maxPolls) {
        setPollingTimedOut(true);
        return; // Stop polling after timeout
      }

      // Continue polling
      timeoutId = setTimeout(poll, POLLING_INTERVAL);
    };

    // Initial check
    poll();

    // Cleanup on unmount
    return () => {
      isCancelled = true;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [checkPaymentStatus, isPlateauOrder, paymentStatus]);

  // For initial loading, fetch order details
  useEffect(() => {
    if (paymentStatus === 'loading' && orderId) {
      checkPaymentStatus();
    }
  }, [paymentStatus, orderId, checkPaymentStatus]);

  // Determine what to show
  const showPending = paymentStatus === 'pending' || paymentStatus === 'loading';
  const showFailed = paymentStatus === 'failed';

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center p-4" dir={direction}>
      <div className="max-w-md w-full text-center">
        {/* Icon based on status */}
        {showFailed ? (
          <div className="relative mx-auto w-24 h-24 mb-8">
            <div className="absolute inset-0 bg-red-100 rounded-full opacity-50" />
            <div className="relative w-24 h-24 bg-gradient-to-br from-red-400 to-red-500
              rounded-full flex items-center justify-center shadow-lg shadow-red-500/30">
              <AlertCircle className="w-12 h-12 text-white" strokeWidth={1.5} />
            </div>
          </div>
        ) : showPending ? (
          <div className="relative mx-auto w-24 h-24 mb-8">
            <div className="absolute inset-0 bg-amber-100 rounded-full opacity-50 animate-pulse" />
            <div className="relative w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-500
              rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30">
              {paymentStatus === 'loading' ? (
                <Loader2 className="w-12 h-12 text-white animate-spin" strokeWidth={1.5} />
              ) : (
                <Clock className="w-12 h-12 text-white" strokeWidth={1.5} />
              )}
            </div>
          </div>
        ) : (
          <div className="relative mx-auto w-24 h-24 mb-8">
            <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-25" />
            <div className="relative w-24 h-24 bg-gradient-to-br from-green-400 to-green-500
              rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
              <CheckCircle className="w-12 h-12 text-white" strokeWidth={1.5} />
            </div>
          </div>
        )}

        {/* Title based on status */}
        <h1 className="font-display text-3xl text-stone-800 mb-3">
          {showFailed
            ? t('checkout.paymentFailed')
            : showPending
              ? t('checkout.orderReceived')
              : t('checkout.success.title')
          }
        </h1>

        {/* Message based on status */}
        <p className="text-stone-600 mb-8 leading-relaxed">
          {showFailed
            ? t('checkout.paymentFailedMessage')
            : isPlateauOrder
              ? t('checkout.plateauOrderNote')
              : showPending
                ? pollingTimedOut
                  ? t('checkout.errors.timeout')
                  : t('checkout.paymentPendingMessage')
                : t('checkout.success.message')
          }
        </p>

        {/* Polling indicator for pending payments */}
        {showPending && !pollingTimedOut && (
          <div className="mb-6 flex items-center justify-center gap-2 text-sm text-amber-600">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>{t('checkout.errors.verifyingPayment')}</span>
          </div>
        )}

        {/* Order Number */}
        {orderId && (
          <div className="bg-white rounded-xl p-5 border border-cream-200 mb-8">
            <p className="text-sm text-stone-500 mb-1">
              {t('checkout.orderNumber')}
            </p>
            <p className="font-display text-xl text-gold-700">
              #{orderId.slice(0, 8)}
            </p>
            {orderDetails?.totalAmount && (
              <p className="text-sm text-stone-500 mt-2">
                {t('checkout.total')}: {orderDetails.totalAmount} ₪
              </p>
            )}
          </div>
        )}

        {/* Plateau order notice */}
        {isPlateauOrder && (
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 mb-8">
            <p className="text-sm text-amber-800">
              {t('checkout.plateauOrderNote')}
            </p>
          </div>
        )}

        {/* Payment failed notice */}
        {showFailed && (
          <div className="bg-red-50 rounded-xl p-4 border border-red-200 mb-8">
            <p className="text-sm text-red-800">
              {t('checkout.paymentFailedNote')}
            </p>
          </div>
        )}

        {/* Timeout notice */}
        {pollingTimedOut && (
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 mb-8">
            <p className="text-sm text-amber-800">
              {t('checkout.errors.checkEmail')}
            </p>
          </div>
        )}

        {/* Contact Info */}
        <div className="flex items-center justify-center gap-3 text-sm text-stone-600 mb-8">
          <Phone className="w-4 h-4" />
          <span>{t('common.questions')}</span>
          <a href={`tel:${WHATSAPP_NUMBER.replace(/\s/g, '')}`} className="text-gold-600 hover:text-gold-700 font-medium">
            {WHATSAPP_NUMBER}
          </a>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          {showFailed ? (
            <>
              <Link
                href="/boutique/checkout"
                className="flex items-center justify-center gap-2 w-full py-3.5
                  bg-gold-500 text-white font-medium rounded-xl
                  shadow-md shadow-gold-500/20
                  hover:bg-gold-600 hover:shadow-lg
                  transition-all duration-200"
              >
                {t('checkout.retry')}
                <Arrow className="w-4 h-4" />
              </Link>
              <Link
                href="/"
                className="block w-full py-3 text-gold-700 hover:text-gold-800
                  font-medium transition-colors"
              >
                {t('notFound.backHome')}
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/"
                className="flex items-center justify-center gap-2 w-full py-3.5
                  bg-gold-500 text-white font-medium rounded-xl
                  shadow-md shadow-gold-500/20
                  hover:bg-gold-600 hover:shadow-lg
                  transition-all duration-200"
              >
                {t('notFound.backHome')}
                <Arrow className="w-4 h-4" />
              </Link>

              <Link
                href="/boutique"
                className="block w-full py-3 text-gold-700 hover:text-gold-800
                  font-medium transition-colors"
              >
                {t('cart.viewMoreProducts')}
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
