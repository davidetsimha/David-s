import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { CheckCircle, ArrowRight, ArrowLeft, Phone } from 'lucide-react';
import { Link } from '@/i18n/navigation';

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '058-781-9457';

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ order_id?: string; type?: string; payment_pending?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'checkout.success' });

  return {
    title: t('title'),
  };
}

export default async function CheckoutSuccessPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { order_id: orderId, type, payment_pending: paymentPending } = await searchParams;
  const t = await getTranslations({ locale });
  const isRTL = locale === 'he';
  const direction = isRTL ? 'rtl' : 'ltr';
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  const isPlateauOrder = type === 'plateau';

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center p-4" dir={direction}>
      <div className="max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="relative mx-auto w-24 h-24 mb-8">
          <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-25" />
          <div className="relative w-24 h-24 bg-gradient-to-br from-green-400 to-green-500
            rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
            <CheckCircle className="w-12 h-12 text-white" strokeWidth={1.5} />
          </div>
        </div>

        <h1 className="font-display text-3xl text-stone-800 mb-3">
          {t('checkout.success.title')}
        </h1>

        <p className="text-stone-600 mb-8 leading-relaxed">
          {isPlateauOrder
            ? t('checkout.plateauOrderNote')
            : paymentPending
              ? t('checkout.success.message')
              : t('checkout.success.message')
          }
        </p>

        {/* Order Number - only show if we have a real order ID */}
        {orderId && (
          <div className="bg-white rounded-xl p-5 border border-cream-200 mb-8">
            <p className="text-sm text-stone-500 mb-1">
              {t('checkout.orderNumber')}
            </p>
            <p className="font-display text-xl text-gold-700">
              #{orderId.slice(0, 8)}
            </p>
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
        </div>
      </div>
    </div>
  );
}
