import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { CheckCircle, ArrowRight, ArrowLeft, Phone, Clock, AlertCircle } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { createClient } from '@supabase/supabase-js';

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '058-781-9457';

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    order_id?: string;
    type?: string;
    payment_pending?: string;
    // CreditGuard callback params
    result?: string;
    tranId?: string;
    uniqueid?: string;
  }>;
};

// Create Supabase client for server component
function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, key);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'checkout.success' });

  return {
    title: t('title'),
  };
}

export default async function CheckoutSuccessPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const {
    order_id: orderIdParam,
    type,
    payment_pending: paymentPending,
    result,
    uniqueid,
  } = await searchParams;

  const t = await getTranslations({ locale });
  const isRTL = locale === 'he';
  const direction = isRTL ? 'rtl' : 'ltr';
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  const isPlateauOrder = type === 'plateau';

  // Determine order ID from params or callback
  const orderId = orderIdParam || uniqueid;

  // Check payment result from CreditGuard redirect
  const paymentApproved = result === '000';
  const paymentDeclined = result && result !== '000';

  // Get order details if we have an order ID
  let order = null;
  let paymentStatus: 'confirmed' | 'pending' | 'failed' | null = null;

  if (orderId) {
    try {
      const supabase = getSupabase();
      const { data } = await supabase
        .from('orders')
        .select('id, status, customer_name, total_amount, payment_status')
        .eq('id', orderId)
        .single();

      order = data;

      // Determine payment status
      if (order) {
        if (order.status === 'confirmed' || order.payment_status === 'approved') {
          paymentStatus = 'confirmed';
        } else if (order.payment_status === 'declined' || paymentDeclined) {
          paymentStatus = 'failed';
        } else {
          paymentStatus = 'pending';
        }
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    }
  }

  // Determine what to show
  const showSuccess = isPlateauOrder || paymentApproved || paymentStatus === 'confirmed';
  const showPending = paymentPending || paymentStatus === 'pending';
  const showFailed = paymentDeclined || paymentStatus === 'failed';

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
            <div className="absolute inset-0 bg-amber-100 rounded-full opacity-50" />
            <div className="relative w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-500
              rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Clock className="w-12 h-12 text-white" strokeWidth={1.5} />
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
                ? t('checkout.paymentPendingMessage')
                : t('checkout.success.message')
          }
        </p>

        {/* Order Number */}
        {orderId && (
          <div className="bg-white rounded-xl p-5 border border-cream-200 mb-8">
            <p className="text-sm text-stone-500 mb-1">
              {t('checkout.orderNumber')}
            </p>
            <p className="font-display text-xl text-gold-700">
              #{orderId.slice(0, 8)}
            </p>
            {order?.total_amount && (
              <p className="text-sm text-stone-500 mt-2">
                {t('checkout.total')}: {order.total_amount} ₪
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
