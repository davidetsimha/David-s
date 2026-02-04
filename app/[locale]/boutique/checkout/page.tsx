'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ArrowLeft, ArrowRight, ShieldCheck, Loader2, Check, CreditCard, Calendar, Clock, Send, AlertTriangle, MapPin, XCircle } from 'lucide-react';
import { useCartStore, useCustomerStore } from '@/stores';
import { CheckoutForm, DeliveryOptions, OrderSummary } from '@/components/checkout';
import type { CheckoutFormData, DeliveryMethod, DeliveryAddress } from '@/components/checkout';
import { useDeliveryZones } from '@/hooks/useDeliveryZones';
import { createOrder } from '@/services/orders.service';
import { initiatePayment } from '@/services/payment.service';
import type { CreateOrderDTO, DeliveryZone } from '@/types';

type CheckoutStep = 'info' | 'delivery' | 'pickup_date' | 'review';

// Helper to get next Friday
function getNextFriday(fromDate: Date = new Date()): Date {
  const date = new Date(fromDate);
  const day = date.getDay();
  const daysUntilFriday = (5 - day + 7) % 7 || 7;
  date.setDate(date.getDate() + daysUntilFriday);
  return date;
}

// Helper to get available pickup dates
function getAvailablePickupDates(isIndividual: boolean, minDaysAdvance: number = 0): Date[] {
  const dates: Date[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (isIndividual) {
    // Individual: only Fridays, next 4 weeks
    let lastFriday = today;
    for (let i = 0; i < 4; i++) {
      const friday = getNextFriday(lastFriday);
      // Check if this Friday respects the minimum days advance
      const diffDays = Math.floor((friday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays >= minDaysAdvance) {
        dates.push(friday);
      }
      lastFriday = new Date(friday);
      lastFriday.setDate(lastFriday.getDate() + 1);
    }
  } else {
    // Plateau: any day, min X days advance, next 3 weeks
    const minDate = new Date(today);
    minDate.setDate(minDate.getDate() + Math.max(minDaysAdvance, 2));

    for (let i = 0; i < 21; i++) {
      const date = new Date(minDate);
      date.setDate(date.getDate() + i);
      // Skip Saturdays (Shabbat) for pickup
      if (date.getDay() !== 6) {
        dates.push(date);
      }
    }
  }

  return dates;
}

// Time slots
const TIME_SLOTS = {
  friday: ['8h30 - 10h00', '10h00 - 11h30', '11h30 - 13h30'],
  weekday: ['10h00 - 12h00', '12h00 - 14h00', '14h00 - 16h00', '16h00 - 18h00', '18h00 - 20h00'],
};

// Format date for display
function formatDate(date: Date, locale: string): string {
  return date.toLocaleDateString(locale === 'he' ? 'he-IL' : 'fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

export default function CheckoutPage() {
  const router = useRouter();
  const locale = useLocale();
  const { items, clearCart, subtotal, getCartType } = useCartStore();
  const { customer, setCustomerInfo, clearCustomerInfo } = useCustomerStore();
  const t = useTranslations();
  const { data: deliveryZones = [] } = useDeliveryZones();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('info');
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('pickup');
  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress>({ street: '', city: '', postalCode: '' });
  const [selectedZone, setSelectedZone] = useState<DeliveryZone | null>(null);
  const [customerData, setCustomerData] = useState<CheckoutFormData | null>(null);
  const [pickupDate, setPickupDate] = useState<Date | null>(null);
  const [pickupTimeSlot, setPickupTimeSlot] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const submissionRef = useRef(false); // Prevent double-click

  const isRTL = locale === 'he';
  const direction = isRTL ? 'rtl' : 'ltr';
  const BackArrow = isRTL ? ArrowRight : ArrowLeft;
  const ForwardArrow = isRTL ? ArrowLeft : ArrowRight;

  // Handle hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Pre-fill delivery address from saved customer data
  useEffect(() => {
    if (isMounted && customer?.deliveryAddress) {
      setDeliveryAddress({
        street: customer.deliveryAddress.street,
        city: customer.deliveryAddress.city,
        postalCode: customer.deliveryAddress.postalCode || '',
      });
    }
  }, [isMounted, customer?.deliveryAddress]);

  // Pre-select delivery zone from saved preference
  useEffect(() => {
    if (isMounted && customer?.preferredDeliveryZoneId && deliveryZones.length > 0 && !selectedZone) {
      const zone = deliveryZones.find(z => z.id === customer.preferredDeliveryZoneId);
      if (zone) {
        setSelectedZone(zone);
      }
    }
  }, [isMounted, customer?.preferredDeliveryZoneId, deliveryZones, selectedZone]);

  // Determine cart type
  const cartType = getCartType();
  const isIndividualOrder = cartType === 'individual' || cartType === null;
  const isPlateauOrder = cartType === 'plateau';

  // Calculate min days advance from cart items
  const minDaysAdvance = useMemo(() => {
    return Math.max(...items.map(item => item.product.min_days_advance || 0), 0);
  }, [items]);

  // Get available pickup dates based on order type
  const availableDates = useMemo(() => {
    return getAvailablePickupDates(isIndividualOrder, minDaysAdvance);
  }, [isIndividualOrder, minDaysAdvance]);

  // Get time slots based on selected date
  const availableTimeSlots = useMemo(() => {
    if (!pickupDate) return [];
    return pickupDate.getDay() === 5 ? TIME_SLOTS.friday : TIME_SLOTS.weekday;
  }, [pickupDate]);

  // Check if this is a late order
  const isLateOrder = useMemo(() => {
    if (!pickupDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffDays = Math.floor((pickupDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (isIndividualOrder) {
      const dayOfWeek = today.getDay();
      return dayOfWeek >= 4 && diffDays <= 1;
    } else {
      return diffDays < minDaysAdvance;
    }
  }, [pickupDate, isIndividualOrder, minDaysAdvance]);

  // Steps vary based on order type
  const steps: CheckoutStep[] = ['info', 'delivery', 'pickup_date', 'review'];
  const currentStepIndex = steps.indexOf(currentStep);

  const handleFormSubmit = (data: CheckoutFormData) => {
    setCustomerData(data);
    setCustomerInfo({
      name: data.name,
      email: data.email,
      phone: data.phone,
    });
    setCurrentStep('delivery');
  };

  const handleDeliveryNext = () => {
    if (deliveryMethod === 'delivery' && (!deliveryAddress.street || !deliveryAddress.city)) {
      return;
    }
    if (deliveryMethod === 'delivery' && !selectedZone) {
      return;
    }
    setCurrentStep('pickup_date');
  };

  const handlePickupDateNext = () => {
    if (!pickupDate || !pickupTimeSlot) {
      return;
    }
    setCurrentStep('review');
  };

  const handleFinalSubmit = async () => {
    if (!customerData || !pickupDate || !pickupTimeSlot) return;

    // Prevent double-click
    if (submissionRef.current) return;
    submissionRef.current = true;

    setIsSubmitting(true);
    setPaymentError(null);

    try {
      const deliveryFee = deliveryMethod === 'delivery' && selectedZone ? selectedZone.price : 0;
      const total = subtotal() + deliveryFee;

      const orderData: CreateOrderDTO = {
        customer_name: customerData.name,
        customer_email: customerData.email,
        customer_phone: customerData.phone,
        delivery_type: deliveryMethod,
        delivery_address: deliveryMethod === 'delivery'
          ? `${deliveryAddress.street}, ${deliveryAddress.city}${deliveryAddress.postalCode ? ' ' + deliveryAddress.postalCode : ''}`
          : undefined,
        delivery_zone_id: deliveryMethod === 'delivery' && selectedZone ? selectedZone.id : undefined,
        pickup_date: pickupDate.toISOString().split('T')[0],
        pickup_time_slot: pickupTimeSlot,
        order_type: isPlateauOrder ? 'plateau' : 'individual',
        confirmation_status: isPlateauOrder ? 'pending_confirmation' : 'not_required',
        is_late_order: isLateOrder,
        items: items.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
          unit_price: item.product.price,
          product_name_fr: item.product.name_fr,
          product_name_he: item.product.name_he,
        })),
      };

      const orderId = await createOrder(orderData);

      // Store order ID in sessionStorage for recovery
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('pendingOrderId', orderId);
      }

      // For plateau orders: no payment, just redirect to confirmation
      // Don't clear cart here - it will be cleared on the success page
      if (isPlateauOrder) {
        router.push(`/${locale}/boutique/checkout/success?order_id=${orderId}&type=plateau`);
        return;
      }

      // Save delivery address to customer store for next time
      setCustomerInfo({
        name: customerData.name,
        email: customerData.email,
        phone: customerData.phone,
        deliveryAddress: deliveryMethod === 'delivery' ? deliveryAddress : undefined,
        preferredDeliveryZoneId: deliveryMethod === 'delivery' && selectedZone ? selectedZone.id : undefined,
      });

      // For individual orders: proceed to payment
      const response = await initiatePayment({
        orderId,
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
        successUrl: `${window.location.origin}/${locale}/boutique/checkout/success?order_id=${orderId}`,
        failureUrl: `${window.location.origin}/${locale}/boutique/checkout/cancel?order_id=${orderId}`,
        callbackUrl: `${window.location.origin}/api/payment/callback`,
        language: locale === 'he' ? 'he' : 'fr',
      });

      if (response.success && response.paymentUrl) {
        // Redirect to payment page - don't clear cart yet
        window.location.href = response.paymentUrl;
      } else {
        // Payment initialization failed - show error, keep cart
        console.error('Payment initialization failed:', response.error);
        setPaymentError(t('checkout.errors.paymentInitFailed'));
        setIsSubmitting(false);
        submissionRef.current = false;
      }
    } catch (error) {
      console.error('Order/Payment error:', error);
      setPaymentError(t('checkout.errors.networkError'));
      setIsSubmitting(false);
      submissionRef.current = false;
    }
  };

  // Show loading state during hydration
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gold-500" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="font-display text-2xl text-stone-800 mb-4">
            {t('checkout.emptyCart')}
          </h1>
          <Link href="/boutique" className="inline-flex items-center gap-2 text-gold-600 hover:text-gold-700 transition-colors">
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
          href="/boutique"
          className="inline-flex items-center gap-2 text-stone-600 hover:text-gold-700 transition-colors mb-8"
        >
          <BackArrow className="w-4 h-4" /> {t('cart.continueShopping')}
        </Link>

        {/* Title */}
        <h1 className="font-display text-3xl md:text-4xl text-stone-800 mb-6">
          {t('checkout.title')}
        </h1>

        {/* Welcome back message for returning customers */}
        {customer?.name && (
          <div className="mb-6 p-4 bg-gold-50 border border-gold-200 rounded-xl flex items-center justify-between">
            <p className="text-gold-800">
              {t('checkout.welcomeBack', { name: customer.name.split(' ')[0] })}
            </p>
            <button
              onClick={() => clearCustomerInfo()}
              className="text-sm text-gold-600 hover:text-gold-700 underline"
            >
              {t('checkout.notYou')}
            </button>
          </div>
        )}

        {/* Progress Steps */}
        <div className="mb-10">
          <div className="flex items-center justify-center gap-2 md:gap-4">
            {steps.map((step, index) => {
              const isCompleted = index < currentStepIndex;
              const isCurrent = index === currentStepIndex;

              return (
                <div key={step} className="flex items-center">
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

                  <span className={`
                    hidden sm:block ms-2 text-sm font-medium
                    ${isCurrent || isCompleted ? 'text-stone-800' : 'text-stone-400'}
                  `}>
                    {step === 'info' && t('checkout.customerInfo')}
                    {step === 'delivery' && t('checkout.deliveryMethod')}
                    {step === 'pickup_date' && (deliveryMethod === 'delivery' ? t('checkout.deliveryDate') : t('checkout.pickupDate'))}
                    {step === 'review' && t('checkout.orderSummary')}
                  </span>

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
                <CheckoutForm
                  onSubmit={handleFormSubmit}
                  isSubmitting={isSubmitting}
                  defaultValues={customer || undefined}
                />
                <div className="mt-6 flex justify-end">
                  <button
                    type="submit"
                    form="checkout-form"
                    className="flex items-center gap-2 px-6 py-3 bg-gold-500 text-white font-medium rounded-xl
                      hover:bg-gold-600 transition-colors"
                  >
                    {t('common.next')}
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

                {/* Zone Selection for delivery */}
                {deliveryMethod === 'delivery' && deliveryZones.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-cream-200">
                    <h4 className="font-display text-base text-stone-800 mb-3 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gold-500" />
                      {t('checkout.selectNeighborhood')}
                    </h4>
                    <div className="grid gap-2">
                      {deliveryZones.map((zone) => (
                        <label
                          key={zone.id}
                          className={`
                            flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all
                            ${selectedZone?.id === zone.id
                              ? 'border-gold-500 bg-gold-50/50'
                              : 'border-stone-200 hover:border-gold-300'
                            }
                          `}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="delivery_zone"
                              value={zone.id}
                              checked={selectedZone?.id === zone.id}
                              onChange={() => setSelectedZone(zone)}
                              className="sr-only"
                            />
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                              ${selectedZone?.id === zone.id ? 'border-gold-500' : 'border-stone-300'}`}>
                              {selectedZone?.id === zone.id && (
                                <div className="w-2 h-2 rounded-full bg-gold-500" />
                              )}
                            </div>
                            <span className="font-medium text-stone-700">
                              {locale === 'fr' ? zone.name_fr : zone.name_he}
                            </span>
                          </div>
                          <span className="font-semibold text-gold-600">{zone.price} ₪</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* No delivery zones message */}
                {deliveryMethod === 'delivery' && deliveryZones.length === 0 && (
                  <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <p className="text-sm text-amber-800">
                      {t('checkout.noDeliveryZones')}
                    </p>
                  </div>
                )}

                <div className="mt-6 flex justify-between">
                  <button
                    onClick={() => setCurrentStep('info')}
                    className="flex items-center gap-2 px-6 py-3 text-stone-600 font-medium rounded-xl
                      hover:bg-cream-100 transition-colors"
                  >
                    <BackArrow className="w-4 h-4" />
                    {t('common.back')}
                  </button>
                  <button
                    onClick={handleDeliveryNext}
                    disabled={deliveryMethod === 'delivery' && (!deliveryAddress.street || !deliveryAddress.city || !selectedZone)}
                    className="flex items-center gap-2 px-6 py-3 bg-gold-500 text-white font-medium rounded-xl
                      hover:bg-gold-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {t('common.next')}
                    <ForwardArrow className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Pickup Date & Time */}
            {currentStep === 'pickup_date' && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-cream-200 animate-fade-in-up">
                <h3 className="font-display text-lg text-stone-800 mb-2 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gold-500" />
                  {deliveryMethod === 'delivery' ? t('checkout.deliveryDate') : t('checkout.pickupDate')}
                </h3>
                <p className="text-sm text-stone-500 mb-4">
                  {isIndividualOrder
                    ? t('checkout.individualNote')
                    : t('checkout.plateauMinDays', { days: minDaysAdvance })
                  }
                </p>

                {/* Date Selection */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
                  {availableDates.map((date) => {
                    const isSelected = pickupDate?.toDateString() === date.toDateString();
                    const isFriday = date.getDay() === 5;
                    return (
                      <button
                        key={date.toISOString()}
                        type="button"
                        onClick={() => {
                          setPickupDate(date);
                          setPickupTimeSlot('');
                        }}
                        className={`
                          p-3 rounded-xl border-2 text-center transition-all
                          ${isSelected
                            ? 'border-gold-500 bg-gold-50 text-gold-700'
                            : 'border-stone-200 hover:border-gold-300'
                          }
                        `}
                      >
                        <p className="text-xs text-stone-500">
                          {date.toLocaleDateString(locale === 'he' ? 'he-IL' : 'fr-FR', { weekday: 'short' })}
                        </p>
                        <p className="font-semibold">
                          {date.toLocaleDateString(locale === 'he' ? 'he-IL' : 'fr-FR', { day: 'numeric', month: 'short' })}
                        </p>
                        {isFriday && (
                          <span className="text-xs text-blue-600">
                            {t('checkout.shabbat')}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Time Slot Selection */}
                {pickupDate && (
                  <div className="animate-fade-in">
                    <h4 className="font-display text-base text-stone-800 mb-3 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gold-500" />
                      {t('checkout.timeSlot')}
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {availableTimeSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setPickupTimeSlot(slot)}
                          className={`
                            p-3 rounded-xl border-2 text-sm font-medium transition-all
                            ${pickupTimeSlot === slot
                              ? 'border-gold-500 bg-gold-50 text-gold-700'
                              : 'border-stone-200 hover:border-gold-300'
                            }
                          `}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Late Order Warning */}
                {isLateOrder && (
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-800">
                        {t('checkout.lateOrder')}
                      </p>
                      <p className="text-xs text-amber-700">
                        {t('checkout.lateOrderNote')}
                      </p>
                    </div>
                  </div>
                )}

                <div className="mt-6 flex justify-between">
                  <button
                    onClick={() => setCurrentStep('delivery')}
                    className="flex items-center gap-2 px-6 py-3 text-stone-600 font-medium rounded-xl
                      hover:bg-cream-100 transition-colors"
                  >
                    <BackArrow className="w-4 h-4" />
                    {t('common.back')}
                  </button>
                  <button
                    onClick={handlePickupDateNext}
                    disabled={!pickupDate || !pickupTimeSlot}
                    className="flex items-center gap-2 px-6 py-3 bg-gold-500 text-white font-medium rounded-xl
                      hover:bg-gold-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {t('common.next')}
                    <ForwardArrow className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Review & Pay */}
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
                      {t('common.edit')}
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
                      {t('common.edit')}
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
                    {deliveryMethod === 'delivery' && selectedZone && (
                      <p className="mt-1 text-sm text-gold-600 font-medium">
                        {locale === 'fr' ? selectedZone.name_fr : selectedZone.name_he} - {selectedZone.price} ₪
                      </p>
                    )}
                  </div>
                </div>

                {/* Pickup/Delivery Date Summary */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-cream-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display text-lg text-stone-800">
                      {deliveryMethod === 'delivery' ? t('checkout.deliveryDate') : t('checkout.pickupDate')}
                    </h3>
                    <button
                      onClick={() => setCurrentStep('pickup_date')}
                      className="text-sm text-gold-600 hover:text-gold-700"
                    >
                      {t('common.edit')}
                    </button>
                  </div>
                  <div className="text-stone-600">
                    {pickupDate && (
                      <p className="font-medium flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gold-500" />
                        {formatDate(pickupDate, locale)}
                      </p>
                    )}
                    {pickupTimeSlot && (
                      <p className="mt-1 text-sm flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gold-500" />
                        {pickupTimeSlot}
                      </p>
                    )}
                    {isLateOrder && (
                      <p className="mt-2 text-xs text-amber-600 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        {t('checkout.lateOrderShort')}
                      </p>
                    )}
                  </div>
                </div>

                {/* Plateau Order Notice */}
                {isPlateauOrder && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <p className="text-sm font-medium text-amber-800 mb-1">
                      {t('checkout.plateauOrder')}
                    </p>
                    <p className="text-xs text-amber-700">
                      {t('checkout.plateauOrderNote')}
                    </p>
                  </div>
                )}

                {/* Back Button */}
                <div className="flex justify-start">
                  <button
                    onClick={() => setCurrentStep('pickup_date')}
                    className="flex items-center gap-2 px-6 py-3 text-stone-600 font-medium rounded-xl
                      hover:bg-cream-100 transition-colors"
                  >
                    <BackArrow className="w-4 h-4" />
                    {t('common.back')}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-24 space-y-6">
              <OrderSummary
                deliveryMethod={deliveryMethod}
                deliveryFee={selectedZone?.price}
              />

              {/* Payment Error Message */}
              {currentStep === 'review' && paymentError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-800">{paymentError}</p>
                    <p className="text-xs text-red-600 mt-1">
                      {t('checkout.errors.tryAgain')}
                    </p>
                  </div>
                </div>
              )}

              {/* Action Button (on review step) */}
              {currentStep === 'review' && (
                <button
                  onClick={handleFinalSubmit}
                  disabled={isSubmitting}
                  className={`w-full flex items-center justify-center gap-3 py-4 text-white
                    font-medium text-lg rounded-xl shadow-lg transition-all
                    ${isPlateauOrder
                      ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20'
                      : 'bg-gold-500 hover:bg-gold-600 shadow-gold-500/20'
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : isPlateauOrder ? (
                    <>
                      <Send className="w-5 h-5" />
                      {t('checkout.sendRequest')}
                    </>
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
                  {/* Hyp */}
                  <div className="h-7 px-3 bg-gradient-to-r from-indigo-600 to-purple-500 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold tracking-wide">Hyp</span>
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
