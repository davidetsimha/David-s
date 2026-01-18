import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowRight, Mail, Search, Package, Loader2 } from 'lucide-react';
import { useCustomerStore } from '../../stores';
import { useCustomerOrders } from '../../hooks/useCustomers';
import { useReorder } from '../../hooks/useReorder';
import { OrderHistoryCard } from '../../components/checkout/OrderHistoryCard';
import { ReorderConfirmDialog } from '../../components/checkout/ReorderConfirmDialog';
import { Input } from '../../components/ui/Input';
import { ROUTES } from '../../config/routes';
import type { Order, OrderStatus } from '../../types';

const statusFilters: (OrderStatus | 'all')[] = ['all', 'pending', 'confirmed', 'completed', 'cancelled'];

const statusLabels: Record<OrderStatus | 'all', Record<string, string>> = {
  all: { fr: 'Toutes', he: 'הכל' },
  pending: { fr: 'En attente', he: 'בהמתנה' },
  confirmed: { fr: 'Confirmées', he: 'אושרו' },
  completed: { fr: 'Terminées', he: 'הושלמו' },
  cancelled: { fr: 'Annulées', he: 'בוטלו' },
};

export function OrderHistoryPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as 'fr' | 'he';
  const direction = i18n.dir();
  const isRTL = direction === 'rtl';
  const BackArrow = isRTL ? ArrowRight : ArrowLeft;

  const { customer } = useCustomerStore();
  const [email, setEmail] = useState(customer?.email || '');
  const [searchEmail, setSearchEmail] = useState(customer?.email || '');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');

  const { data: orders, isLoading, error } = useCustomerOrders(searchEmail);
  const {
    isReordering,
    showConfirmDialog,
    initiateReorder,
    handleDialogAction,
    closeDialog,
  } = useReorder();

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

  return (
    <div className="min-h-screen bg-cream-50" dir={direction}>
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Back link */}
        <Link
          to={ROUTES.SHOP}
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
              {t('orderHistory.enterEmailPrompt', 'Entrez votre email pour voir vos commandes')}
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
