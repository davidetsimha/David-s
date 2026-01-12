import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { XCircle, ArrowRight, ArrowLeft, ShoppingBag } from 'lucide-react';
import { ROUTES } from '../../config/routes';

export function CheckoutCancelPage() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';
  const direction = i18n.dir();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;
  const BackArrow = isRTL ? ArrowRight : ArrowLeft;

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center p-4" dir={direction}>
      <div className="max-w-md w-full text-center">
        {/* Cancel Icon */}
        <div className="relative mx-auto w-24 h-24 mb-8">
          <div className="absolute inset-0 bg-stone-200 rounded-full opacity-50" />
          <div className="relative w-24 h-24 bg-gradient-to-br from-stone-400 to-stone-500
            rounded-full flex items-center justify-center shadow-lg shadow-stone-400/30">
            <XCircle className="w-12 h-12 text-white" strokeWidth={1.5} />
          </div>
        </div>

        <h1 className="font-display text-3xl text-stone-800 mb-3">
          {t('checkout.orderCancelled')}
        </h1>

        <p className="text-stone-600 mb-8 leading-relaxed">
          {t('checkout.cancel.message')}
        </p>

        {/* Message Box */}
        <div className="bg-white rounded-xl p-5 border border-cream-200 mb-8 text-start">
          <p className="text-sm text-stone-500 mb-2">
            {t('checkout.needHelp', 'Besoin d\'aide?')}
          </p>
          <p className="text-stone-700">
            {t('checkout.helpMessage', 'Si vous avez rencontre un probleme, n\'hesitez pas a nous contacter.')}
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link
            to={ROUTES.CHECKOUT}
            className="flex items-center justify-center gap-2 w-full py-3.5
              bg-gold-500 text-white font-medium rounded-xl
              shadow-md shadow-gold-500/20
              hover:bg-gold-600 hover:shadow-lg
              transition-all duration-200"
          >
            <ShoppingBag className="w-4 h-4" />
            {t('checkout.retry')}
          </Link>

          <Link
            to={ROUTES.HOME}
            className="flex items-center justify-center gap-2 w-full py-3
              text-stone-600 hover:text-gold-700 font-medium transition-colors"
          >
            <BackArrow className="w-4 h-4" />
            {t('notFound.backHome')}
          </Link>

          <Link
            to={ROUTES.CONTACT}
            className="block w-full py-2 text-sm text-gold-600 hover:text-gold-700
              transition-colors"
          >
            {t('checkout.contactUs')}
            <Arrow className="w-3 h-3 inline-block ms-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
