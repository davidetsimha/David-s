'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/src/i18n/navigation';
import { ArrowLeft, ArrowRight, Mail, Search, Package, Loader2 } from 'lucide-react';
import { useCustomerStore, useCartStore } from '@/src/stores';
import { useCustomerOrders } from '@/src/hooks/useCustomers';
import { getProductById } from '@/src/services/products.service';
import { OrderHistoryCard, ReorderConfirmDialog, type ReorderAction } from '@/components/orders';
import { Input } from '@/src/components/ui/Input';
import type { Order, OrderStatus } from '@/src/types';

const statusFilters: (OrderStatus | 'all')[] = ['all', 'pending', 'confirmed', 'completed', 'cancelled'];

const statusLabels: Record<OrderStatus | 'all', Record<string, string>> = {
  all: { fr: 'Toutes', he: 'הכל' },
  pending: { fr: 'En attente', he: 'בהמתנה' },
  confirmed: { fr: 'Confirmees', he: 'אושרו' },
  completed: { fr: 'Terminees', he: 'הושלמו' },
  cancelled: { fr: 'Annulees', he: 'בוטלו' },
};

export default function OrderHistoryPage() {
  const router = useRouter();
  const t = useTranslations();
  const locale = useLocale();
  const lang = locale as 'fr' | 'he';
  const direction = locale === 'he' ? 'rtl' : 'ltr';
  const isRTL = direction === 'rtl';
  const BackArrow = isRTL ? ArrowRight : ArrowLeft;

  const { customer } = useCustomerStore();
  const { items: cartItems, addItem, clearCart } = useCartStore();
  const [email, setEmail] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [isMounted, setIsMounted] = useState(false);

  // Reorder state
  const [isReordering, setIsReordering] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingOrder, setPendingOrder] = useState<Order | null>(null);

  const { data: orders, isLoading, error } = useCustomerOrders(searchEmail);

  // Handle hydration
  useEffect(() => {
    setIsMounted(true);
    if (customer?.email) {
      setEmail(customer.email);
      setSearchEmail(customer.email);
    }
  }, [customer?.email]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSearchEmail(email.trim().toLowerCase());
    }
  };

  const filteredOrders = orders?.filter((order: Order) => {
    if (statusFilter === 'all') return true;
    return order.status === statusFilter;
  }) || [];

  // Reorder logic
  const processReorder = useCallback(async (
    order: Order,
    action: ReorderAction
  ) => {
    if (action === 'cancel') {
      return;
    }

    setIsReordering(true);

    try {
      // Clear cart if replacing
      if (action === 'replace') {
        clearCart();
      }

      // Process each item from the order
      if (order.items && order.items.length > 0) {
        for (const orderItem of order.items) {
          if (!orderItem.product_id) {
            continue;
          }

          try {
            const product = await getProductById(orderItem.product_id);

            if (!product.available) {
              continue;
            }

            addItem(product, orderItem.quantity);
          } catch {
            // Product not found or error
          }
        }
      }

      // Navigate to checkout
      router.push(`/${locale}/boutique/checkout`);
    } finally {
      setIsReordering(false);
    }
  }, [addItem, clearCart, router, locale]);

  const initiateReorder = useCallback((order: Order) => {
    if (cartItems.length > 0) {
      setPendingOrder(order);
      setShowConfirmDialog(true);
    } else {
      processReorder(order, 'replace');
    }
  }, [cartItems.length, processReorder]);

  const handleDialogAction = useCallback((action: ReorderAction) => {
    setShowConfirmDialog(false);
    if (pendingOrder && action !== 'cancel') {
      processReorder(pendingOrder, action);
    }
    setPendingOrder(null);
  }, [pendingOrder, processReorder]);

  const closeDialog = useCallback(() => {
    setShowConfirmDialog(false);
    setPendingOrder(null);
  }, []);

  // Show loading state during hydration
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gold-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50" dir={direction}>
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Back link */}
        <Link
          href="/boutique"
          className="inline-flex items-center gap-2 text-stone-600 hover:text-gold-700 transition-colors mb-8"
        >
          <BackArrow className="w-4 h-4" /> {t('cart.continueShopping')}
        </Link>

        {/* Title */}
        <h1 className="font-display text-3xl md:text-4xl text-stone-800 mb-2">
          {t('orderHistory.title')}
        </h1>
        <p className="text-stone-500 mb-8">
          {t('orderHistory.enterEmail')}
        </p>

        {/* Email search form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Mail className="absolute top-1/2 -translate-y-1/2 start-3 w-5 h-5 text-stone-400 pointer-events-none" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('checkout.email')}
                className="ps-11"
                required
              />
            </div>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 bg-gold-500 text-white font-medium rounded-xl
                hover:bg-gold-600 transition-colors"
            >
              <Search className="w-4 h-4" />
              {t('orderHistory.search')}
            </button>
          </div>
        </form>

        {/* Status filters */}
        {searchEmail && orders && orders.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {statusFilters.map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                  ${statusFilter === status
                    ? 'bg-gold-500 text-white'
                    : 'bg-white text-stone-600 border border-stone-200 hover:border-gold-300'
                  }`}
              >
                {statusLabels[status][lang]}
              </button>
            ))}
          </div>
        )}

        {/* Results */}
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-gold-500 animate-spin" />
          </div>
        )}

        {error && (
          <div className="text-center py-16">
            <p className="text-red-600">{t('common.error')}</p>
          </div>
        )}

        {searchEmail && !isLoading && !error && filteredOrders.length === 0 && (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-stone-300 mx-auto mb-4" />
            <p className="text-stone-500 text-lg">{t('orderHistory.noOrders')}</p>
          </div>
        )}

        {filteredOrders.length > 0 && (
          <div className="space-y-4">
            {filteredOrders.map((order: Order) => (
              <OrderHistoryCard
                key={order.id}
                order={order}
                onReorder={initiateReorder}
                isReordering={isReordering}
              />
            ))}
          </div>
        )}

        {/* Initial state - no search yet */}
        {!searchEmail && (
          <div className="text-center py-16">
            <Mail className="w-16 h-16 text-stone-300 mx-auto mb-4" />
            <p className="text-stone-500">
              {t('orderHistory.enterEmail')}
            </p>
          </div>
        )}
      </div>

      {/* Reorder confirm dialog */}
      <ReorderConfirmDialog
        open={showConfirmDialog}
        onClose={closeDialog}
        onAction={handleDialogAction}
      />
    </div>
  );
}
