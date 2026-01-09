import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';
import { useCartStore, useLanguageStore } from '../../stores';
import { CheckoutForm, DeliveryOptions, OrderSummary } from '../../components/checkout';
import type { CheckoutFormData, DeliveryMethod } from '../../components/checkout';
import { ROUTES } from '../../config/routes';

export function CheckoutPage() {
  const navigate = useNavigate();
  const { items, clearCart } = useCartStore();
  const { t, direction } = useLanguageStore();
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('pickup');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isRTL = direction === 'rtl';
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
            {t('Votre panier est vide', 'סל הקניות שלך ריק')}
          </h1>
          <Link to={ROUTES.RECEPTIONS} className="inline-flex items-center gap-2 text-gold-600">
            <BackArrow className="w-4 h-4" /> {t('Retour aux produits', 'חזרה למוצרים')}
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
          <BackArrow className="w-4 h-4" /> {t('Continuer mes achats', 'המשך לקנות')}
        </Link>
        <h1 className="font-display text-3xl md:text-4xl text-stone-800 mb-8">
          {t('Finaliser la commande', 'סיום ההזמנה')}
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
            <SubmitButton isSubmitting={isSubmitting} t={t} className="hidden lg:flex" />
          </div>
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-24">
              <OrderSummary deliveryMethod={deliveryMethod} />
              <div className="mt-6 p-4 bg-white rounded-xl border border-cream-200">
                <div className="flex items-center gap-3 text-sm text-stone-600">
                  <ShieldCheck className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span>{t('Paiement sécurisé et données protégées', 'תשלום מאובטח ונתונים מוגנים')}</span>
                </div>
              </div>
              <SubmitButton isSubmitting={isSubmitting} t={t} className="lg:hidden mt-6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SubmitButton({ isSubmitting, t, className }: {
  isSubmitting: boolean; t: (fr: string, he: string) => string; className?: string
}) {
  return (
    <button type="submit" disabled={isSubmitting} className={`w-full items-center justify-center
      gap-2 py-4 bg-gold-500 text-white font-medium rounded-xl shadow-lg shadow-gold-500/20
      hover:bg-gold-600 disabled:opacity-50 transition-all ${className}`}>
      {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (
        <><ShieldCheck className="w-5 h-5" /> {t('Confirmer la commande', 'אישור הזמנה')}</>
      )}
    </button>
  );
}
