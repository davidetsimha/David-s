import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';
import { useCartStore } from '../../stores';
import { CheckoutForm, DeliveryOptions, OrderSummary } from '../../components/checkout';
import type { CheckoutFormData, DeliveryMethod, DeliveryAddress } from '../../components/checkout';
import { ROUTES } from '../../config/routes';

export function CheckoutPage() {
  const navigate = useNavigate();
  const { items, clearCart } = useCartStore();
  const { t, i18n } = useTranslation();
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('pickup');
  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress>({ street: '', city: '', postalCode: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isRTL = i18n.dir() === 'rtl';
  const direction = i18n.dir();
  const BackArrow = isRTL ? ArrowRight : ArrowLeft;

  const handleSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    console.log('Order:', { ...data, deliveryMethod, deliveryAddress, items });
    clearCart();
    navigate(ROUTES.CHECKOUT_SUCCESS);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="font-display text-2xl text-stone-800 mb-4">
            {t('checkout.emptyCart')}
          </h1>
          <Link to={ROUTES.RECEPTIONS} className="inline-flex items-center gap-2 text-gold-600">
            <BackArrow className="w-4 h-4" /> {t('checkout.backToProducts')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50" dir={direction}>
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <Link to={ROUTES.RECEPTIONS} className="inline-flex items-center gap-2 text-stone-600
          hover:text-gold-700 transition-colors mb-8">
          <BackArrow className="w-4 h-4" /> {t('cart.continueShopping')}
        </Link>
        <h1 className="font-display text-3xl md:text-4xl text-stone-800 mb-8">
          {t('checkout.title')}
        </h1>
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          <div className="lg:col-span-3 space-y-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-cream-200">
              <CheckoutForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-cream-200">
              <DeliveryOptions value={deliveryMethod} onChange={setDeliveryMethod}
                address={deliveryAddress} onAddressChange={setDeliveryAddress} />
            </div>
            <SubmitButton isSubmitting={isSubmitting} className="hidden lg:flex" />
          </div>
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-24">
              <OrderSummary deliveryMethod={deliveryMethod} />
              <div className="mt-6 p-4 bg-white rounded-xl border border-cream-200">
                <div className="flex items-center gap-3 text-sm text-stone-600">
                  <ShieldCheck className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span>{t('checkout.securePayment')}</span>
                </div>
              </div>
              <SubmitButton isSubmitting={isSubmitting} className="lg:hidden mt-6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SubmitButton({ isSubmitting, className }: {
  isSubmitting: boolean; className?: string
}) {
  const { t } = useTranslation();

  return (
    <div className={`space-y-3 ${className}`}>
      <button type="submit" form="checkout-form" disabled={isSubmitting} className="w-full flex items-center justify-center
        gap-2 py-4 bg-gold-500 text-white font-medium rounded-xl shadow-lg shadow-gold-500/20
        hover:bg-gold-600 disabled:opacity-50 transition-all">
        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (
          <><ShieldCheck className="w-5 h-5" /> {t('checkout.confirmOrder')}</>
        )}
      </button>
      {/* Payment method icons for trust */}
      <div className="flex items-center justify-center gap-3">
        <span className="text-xs text-stone-400">{t('checkout.paymentAccepted')}</span>
        <div className="flex items-center gap-2">
          {/* Visa icon */}
          <svg className="h-6 w-auto" viewBox="0 0 48 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="48" height="16" rx="2" fill="#1A1F71"/>
            <path d="M19.5 4.5L17.5 11.5H15.5L17.5 4.5H19.5Z" fill="white"/>
            <path d="M26.5 4.5L24 9.5L23.5 4.5H21L22.5 11.5H25L28.5 4.5H26.5Z" fill="white"/>
            <path d="M13 4.5L10 11.5H7.5L6 5.5C6 5 5.5 4.5 5 4.5H2V4.5H7C7.5 4.5 8 5 8 5.5L9 10L11.5 4.5H13Z" fill="white"/>
            <path d="M30 4.5C29 4.5 28.5 5 28.5 5.5C28.5 7 32 7 32 9C32 10.5 30.5 11.5 29 11.5C28 11.5 27 11 27 11L27.5 9.5C27.5 9.5 28.5 10 29 10C29.5 10 30 9.5 30 9C30 7.5 26.5 7.5 26.5 5.5C26.5 4 28 3.5 29.5 3.5C30.5 3.5 31.5 4 31.5 4L31 5.5C31 5.5 30 4.5 30 4.5Z" fill="white"/>
            <path d="M35 11.5H32.5L33 10H35.5C36 10 36.5 9.5 36.5 9L37 4.5H39L38.5 9C38.5 10.5 37 11.5 35 11.5Z" fill="white"/>
          </svg>
          {/* Mastercard icon */}
          <svg className="h-6 w-auto" viewBox="0 0 48 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="48" height="16" rx="2" fill="#F5F5F5"/>
            <circle cx="18" cy="8" r="5" fill="#EB001B"/>
            <circle cx="30" cy="8" r="5" fill="#F79E1B"/>
            <path d="M24 4.27C25.5 5.5 26.5 7.1 26.5 8C26.5 8.9 25.5 10.5 24 11.73C22.5 10.5 21.5 8.9 21.5 8C21.5 7.1 22.5 5.5 24 4.27Z" fill="#FF5F00"/>
          </svg>
          {/* TWINT icon (Swiss payment) */}
          <div className="h-6 px-2 bg-black rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">TWINT</span>
          </div>
        </div>
      </div>
    </div>
  );
}
