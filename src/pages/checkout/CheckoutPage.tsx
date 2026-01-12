import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowRight, ShieldCheck, Loader2, Check, CreditCard } from 'lucide-react';
import { useCartStore } from '../../stores';
import { CheckoutForm, DeliveryOptions, OrderSummary } from '../../components/checkout';
import type { CheckoutFormData, DeliveryMethod, DeliveryAddress } from '../../components/checkout';
import { ROUTES } from '../../config/routes';
import { initiatePayment } from '../../services/payment.service';
import { createOrder, updateOrderStatus } from '../../services/orders.service';
import { useConfig } from '../../hooks/useConfig';
import type { CreateOrderDTO } from '../../types';

const DEFAULT_DELIVERY_FEE = 15;

type CheckoutStep = 'info' | 'delivery' | 'review';

const steps: CheckoutStep[] = ['info', 'delivery', 'review'];

export function CheckoutPage() {
  const navigate = useNavigate();
  const { items, clearCart, subtotal } = useCartStore();
  const { t, i18n } = useTranslation();
  const { data: deliveryFeeConfig } = useConfig('delivery_fee');
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('info');
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('pickup');
  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress>({ street: '', city: '', postalCode: '' });
  const [customerData, setCustomerData] = useState<CheckoutFormData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isRTL = i18n.dir() === 'rtl';
  const direction = i18n.dir();
  const BackArrow = isRTL ? ArrowRight : ArrowLeft;
  const ForwardArrow = isRTL ? ArrowLeft : ArrowRight;

  const deliveryFeeAmount = deliveryFeeConfig ? parseFloat(deliveryFeeConfig) : DEFAULT_DELIVERY_FEE;
  const currentStepIndex = steps.indexOf(currentStep);

  const handleFormSubmit = (data: CheckoutFormData) => {
    setCustomerData(data);
    setCurrentStep('delivery');
  };

  const handleDeliveryNext = () => {
    if (deliveryMethod === 'delivery' && (!deliveryAddress.street || !deliveryAddress.city)) {
      return; // Don't proceed without address
    }
    setCurrentStep('review');
  };

  const handleFinalSubmit = async () => {
    if (!customerData) return;

    setIsSubmitting(true);

    try {
      const deliveryFee = deliveryMethod === 'delivery' ? deliveryFeeAmount : 0;
      const total = subtotal() + deliveryFee;

      // ETAPE 1: Creer la commande en base AVANT le paiement
      const orderData: CreateOrderDTO = {
        customer_name: customerData.name,
        customer_email: customerData.email,
        customer_phone: customerData.phone,
        delivery_type: deliveryMethod,
        delivery_address: deliveryMethod === 'delivery'
          ? `${deliveryAddress.street}, ${deliveryAddress.city}${deliveryAddress.postalCode ? ' ' + deliveryAddress.postalCode : ''}`
          : undefined,
        items: items.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
          unit_price: item.product.price,
          product_name_fr: item.product.name_fr,
          product_name_he: item.product.name_he,
        })),
      };

      const orderId = await createOrder(orderData);

      // ETAPE 2: Tenter le paiement
      const response = await initiatePayment({
        amount: total,
        currency: 'ILS',
        items: items.map(item => ({
          name: item.product.name_fr || item.product.name_he,
          quantity: item.quantity,
          price: item.product.price,
        })),
        customer: customerData,
        deliveryMethod,
        deliveryAddress: deliveryMethod === 'delivery' ? deliveryAddress : undefined,
        successUrl: `${window.location.origin}${ROUTES.CHECKOUT_SUCCESS}?order_id=${orderId}`,
        failureUrl: `${window.location.origin}${ROUTES.CHECKOUT_CANCEL}?order_id=${orderId}`,
        callbackUrl: `${window.location.origin}/api/payment/callback`,
      });

      if (response.success) {
        // ETAPE 3: Mettre a jour le statut de la commande
        await updateOrderStatus(orderId, 'confirmed');

        if (response.paymentUrl) {
          // Redirect to PayPlus payment page
          window.location.href = response.paymentUrl;
        } else {
          // Mock/dev mode - simulate success
          clearCart();
          navigate(`${ROUTES.CHECKOUT_SUCCESS}?order_id=${orderId}`);
        }
      } else {
        // Le paiement a echoue mais la commande est sauvegardee (status: pending)
        console.error('Payment failed:', response.error);
        // On peut quand meme vider le panier et rediriger vers la page de succes
        // car la commande est enregistree
        clearCart();
        navigate(`${ROUTES.CHECKOUT_SUCCESS}?order_id=${orderId}&payment_pending=true`);
      }
    } catch (error) {
      console.error('Order/Payment error:', error);
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="font-display text-2xl text-stone-800 mb-4">
            {t('checkout.emptyCart')}
          </h1>
          <Link to={ROUTES.SHABBAT} className="inline-flex items-center gap-2 text-gold-600 hover:text-gold-700 transition-colors">
            <BackArrow className="w-4 h-4" /> {t('checkout.backToProducts')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50" dir={direction}>
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* Back link */}
        <Link
          to={ROUTES.SHABBAT}
          className="inline-flex items-center gap-2 text-stone-600 hover:text-gold-700 transition-colors mb-8"
        >
          <BackArrow className="w-4 h-4" /> {t('cart.continueShopping')}
        </Link>

        {/* Title */}
        <h1 className="font-display text-3xl md:text-4xl text-stone-800 mb-6">
          {t('checkout.title')}
        </h1>

        {/* Progress Steps */}
        <div className="mb-10">
          <div className="flex items-center justify-center gap-2 md:gap-4">
            {steps.map((step, index) => {
              const isCompleted = index < currentStepIndex;
              const isCurrent = index === currentStepIndex;

              return (
                <div key={step} className="flex items-center">
                  {/* Step circle */}
                  <button
                    onClick={() => isCompleted && setCurrentStep(step)}
                    disabled={!isCompleted}
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm
                      transition-all duration-300
                      ${isCompleted
                        ? 'bg-gold-500 text-white cursor-pointer hover:bg-gold-600'
                        : isCurrent
                          ? 'bg-gold-500 text-white'
                          : 'bg-cream-200 text-stone-400'
                      }
                    `}
                  >
                    {isCompleted ? <Check className="w-5 h-5" /> : index + 1}
                  </button>

                  {/* Step label */}
                  <span className={`
                    hidden sm:block ms-2 text-sm font-medium
                    ${isCurrent || isCompleted ? 'text-stone-800' : 'text-stone-400'}
                  `}>
                    {step === 'info' && t('checkout.customerInfo')}
                    {step === 'delivery' && t('checkout.deliveryMethod')}
                    {step === 'review' && t('checkout.orderSummary')}
                  </span>

                  {/* Connector line */}
                  {index < steps.length - 1 && (
                    <div className={`
                      w-8 md:w-16 h-0.5 mx-2 md:mx-4
                      ${index < currentStepIndex ? 'bg-gold-500' : 'bg-cream-300'}
                    `} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Left Column - Forms */}
          <div className="lg:col-span-3 space-y-6">
            {/* Step 1: Customer Info */}
            {currentStep === 'info' && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-cream-200 animate-fade-in-up">
                <CheckoutForm onSubmit={handleFormSubmit} isSubmitting={isSubmitting} />
                <div className="mt-6 flex justify-end">
                  <button
                    type="submit"
                    form="checkout-form"
                    className="flex items-center gap-2 px-6 py-3 bg-gold-500 text-white font-medium rounded-xl
                      hover:bg-gold-600 transition-colors"
                  >
                    {t('common.next') || 'Suivant'}
                    <ForwardArrow className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Delivery */}
            {currentStep === 'delivery' && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-cream-200 animate-fade-in-up">
                <DeliveryOptions
                  value={deliveryMethod}
                  onChange={setDeliveryMethod}
                  address={deliveryAddress}
                  onAddressChange={setDeliveryAddress}
                />
                <div className="mt-6 flex justify-between">
                  <button
                    onClick={() => setCurrentStep('info')}
                    className="flex items-center gap-2 px-6 py-3 text-stone-600 font-medium rounded-xl
                      hover:bg-cream-100 transition-colors"
                  >
                    <BackArrow className="w-4 h-4" />
                    {t('common.back') || 'Retour'}
                  </button>
                  <button
                    onClick={handleDeliveryNext}
                    disabled={deliveryMethod === 'delivery' && (!deliveryAddress.street || !deliveryAddress.city)}
                    className="flex items-center gap-2 px-6 py-3 bg-gold-500 text-white font-medium rounded-xl
                      hover:bg-gold-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {t('common.next') || 'Suivant'}
                    <ForwardArrow className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Review & Pay */}
            {currentStep === 'review' && (
              <div className="space-y-6 animate-fade-in-up">
                {/* Customer Summary */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-cream-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display text-lg text-stone-800">
                      {t('checkout.customerInfo')}
                    </h3>
                    <button
                      onClick={() => setCurrentStep('info')}
                      className="text-sm text-gold-600 hover:text-gold-700"
                    >
                      {t('common.edit') || 'Modifier'}
                    </button>
                  </div>
                  {customerData && (
                    <div className="text-stone-600 space-y-1">
                      <p>{customerData.name}</p>
                      <p>{customerData.email}</p>
                      <p>{customerData.phone}</p>
                    </div>
                  )}
                </div>

                {/* Delivery Summary */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-cream-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display text-lg text-stone-800">
                      {t('checkout.deliveryMethod')}
                    </h3>
                    <button
                      onClick={() => setCurrentStep('delivery')}
                      className="text-sm text-gold-600 hover:text-gold-700"
                    >
                      {t('common.edit') || 'Modifier'}
                    </button>
                  </div>
                  <div className="text-stone-600">
                    <p className="font-medium">
                      {deliveryMethod === 'pickup' ? t('checkout.pickup') : t('checkout.delivery')}
                    </p>
                    {deliveryMethod === 'delivery' && deliveryAddress.street && (
                      <p className="mt-1 text-sm">
                        {deliveryAddress.street}, {deliveryAddress.city}
                        {deliveryAddress.postalCode && ` ${deliveryAddress.postalCode}`}
                      </p>
                    )}
                  </div>
                </div>

                {/* Payment Button */}
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => setCurrentStep('delivery')}
                    className="flex items-center gap-2 px-6 py-3 text-stone-600 font-medium rounded-xl
                      hover:bg-cream-100 transition-colors"
                  >
                    <BackArrow className="w-4 h-4" />
                    {t('common.back') || 'Retour'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-24 space-y-6">
              <OrderSummary deliveryMethod={deliveryMethod} />

              {/* Payment Button (on review step) */}
              {currentStep === 'review' && (
                <button
                  onClick={handleFinalSubmit}
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-3 py-4 bg-gold-500 text-white
                    font-medium text-lg rounded-xl shadow-lg shadow-gold-500/20
                    hover:bg-gold-600 disabled:opacity-50 transition-all"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      {t('checkout.payNow')}
                    </>
                  )}
                </button>
              )}

              {/* Security badge */}
              <div className="p-4 bg-white rounded-xl border border-cream-200">
                <div className="flex items-center gap-3 text-sm text-stone-600">
                  <ShieldCheck className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span>{t('checkout.securePayment')}</span>
                </div>
              </div>

              {/* Payment methods */}
              <div className="flex flex-col items-center gap-2">
                <span className="text-xs text-stone-400">{t('checkout.paymentAccepted')}</span>
                <div className="flex items-center gap-3">
                  {/* Visa */}
                  <svg className="h-7 w-auto" viewBox="0 0 48 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="48" height="16" rx="2" fill="#1A1F71"/>
                    <path d="M19.5 4.5L17.5 11.5H15.5L17.5 4.5H19.5Z" fill="white"/>
                    <path d="M26.5 4.5L24 9.5L23.5 4.5H21L22.5 11.5H25L28.5 4.5H26.5Z" fill="white"/>
                    <path d="M13 4.5L10 11.5H7.5L6 5.5C6 5 5.5 4.5 5 4.5H2V4.5H7C7.5 4.5 8 5 8 5.5L9 10L11.5 4.5H13Z" fill="white"/>
                    <path d="M30 4.5C29 4.5 28.5 5 28.5 5.5C28.5 7 32 7 32 9C32 10.5 30.5 11.5 29 11.5C28 11.5 27 11 27 11L27.5 9.5C27.5 9.5 28.5 10 29 10C29.5 10 30 9.5 30 9C30 7.5 26.5 7.5 26.5 5.5C26.5 4 28 3.5 29.5 3.5C30.5 3.5 31.5 4 31.5 4L31 5.5C31 5.5 30 4.5 30 4.5Z" fill="white"/>
                    <path d="M35 11.5H32.5L33 10H35.5C36 10 36.5 9.5 36.5 9L37 4.5H39L38.5 9C38.5 10.5 37 11.5 35 11.5Z" fill="white"/>
                  </svg>
                  {/* Mastercard */}
                  <svg className="h-7 w-auto" viewBox="0 0 48 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="48" height="16" rx="2" fill="#F5F5F5"/>
                    <circle cx="18" cy="8" r="5" fill="#EB001B"/>
                    <circle cx="30" cy="8" r="5" fill="#F79E1B"/>
                    <path d="M24 4.27C25.5 5.5 26.5 7.1 26.5 8C26.5 8.9 25.5 10.5 24 11.73C22.5 10.5 21.5 8.9 21.5 8C21.5 7.1 22.5 5.5 24 4.27Z" fill="#FF5F00"/>
                  </svg>
                  {/* PayPlus */}
                  <div className="h-7 px-3 bg-gradient-to-r from-blue-600 to-blue-500 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold tracking-wide">PayPlus</span>
                  </div>
                  {/* Bit */}
                  <div className="h-7 px-3 bg-gradient-to-r from-green-500 to-green-400 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">Bit</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
