import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, ArrowLeft, Phone } from 'lucide-react';
import { useLanguageStore } from '../../stores';
import { ROUTES } from '../../config/routes';

export function CheckoutSuccessPage() {
  const { t, direction } = useLanguageStore();
  const isRTL = direction === 'rtl';
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

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
          {t('Commande confirmée!', 'ההזמנה אושרה!')}
        </h1>

        <p className="text-stone-600 mb-8 leading-relaxed">
          {t(
            'Merci pour votre commande! Nous vous contacterons sous peu pour confirmer les détails.',
            'תודה על הזמנתך! ניצור איתך קשר בקרוב לאישור הפרטים.'
          )}
        </p>

        {/* Order Number */}
        <div className="bg-white rounded-xl p-5 border border-cream-200 mb-8">
          <p className="text-sm text-stone-500 mb-1">
            {t('Numéro de commande', 'מספר הזמנה')}
          </p>
          <p className="font-display text-xl text-gold-700">
            #DP-{Date.now().toString().slice(-6)}
          </p>
        </div>

        {/* Contact Info */}
        <div className="flex items-center justify-center gap-3 text-sm text-stone-600 mb-8">
          <Phone className="w-4 h-4" />
          <span>{t('Questions?', 'שאלות?')}</span>
          <a href="tel:+41000000000" className="text-gold-600 hover:text-gold-700 font-medium">
            +41 00 000 00 00
          </a>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link
            to={ROUTES.HOME}
            className="flex items-center justify-center gap-2 w-full py-3.5
              bg-gold-500 text-white font-medium rounded-xl
              shadow-md shadow-gold-500/20
              hover:bg-gold-600 hover:shadow-lg
              transition-all duration-200"
          >
            {t("Retour à l'accueil", 'חזרה לדף הבית')}
            <Arrow className="w-4 h-4" />
          </Link>

          <Link
            to={ROUTES.RECEPTIONS}
            className="block w-full py-3 text-gold-700 hover:text-gold-800
              font-medium transition-colors"
          >
            {t('Voir plus de produits', 'צפה במוצרים נוספים')}
          </Link>
        </div>
      </div>
    </div>
  );
}
