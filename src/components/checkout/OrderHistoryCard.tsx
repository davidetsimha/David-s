import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronUp, Calendar, Clock, RefreshCw } from 'lucide-react';
import { Badge } from '../ui/Badge';
import type { Order, OrderStatus } from '../../types';

const statusLabels: Record<OrderStatus, Record<string, string>> = {
  pending: { fr: 'En attente', he: 'בהמתנה' },
  confirmed: { fr: 'Confirmée', he: 'אושרה' },
  completed: { fr: 'Terminée', he: 'הושלמה' },
  cancelled: { fr: 'Annulée', he: 'בוטלה' },
};

interface OrderHistoryCardProps {
  order: Order;
  onReorder: (order: Order) => void;
  isReordering?: boolean;
}

export function OrderHistoryCard({ order, onReorder, isReordering }: OrderHistoryCardProps) {
  const { t, i18n } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const lang = i18n.language as 'fr' | 'he';
  const direction = i18n.dir();

  const orderDate = new Date(order.created_at).toLocaleDateString(
    lang === 'he' ? 'he-IL' : 'fr-FR',
    { day: 'numeric', month: 'long', year: 'numeric' }
  );

  const pickupDate = order.pickup_date
    ? new Date(order.pickup_date).toLocaleDateString(
        lang === 'he' ? 'he-IL' : 'fr-FR',
        { weekday: 'long', day: 'numeric', month: 'long' }
      )
    : null;

  const itemCount = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <div
      className="bg-white rounded-xl border border-cream-200 shadow-sm overflow-hidden"
      dir={direction}
    >
      {/* Header */}
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* Order ID and Status */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-stone-400 font-mono">
                #{order.id.slice(0, 8)}
              </span>
              <Badge status={order.status}>
                {statusLabels[order.status][lang]}
              </Badge>
              {order.order_type === 'plateau' && (
                <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full">
                  Plateau
                </span>
              )}
            </div>

            {/* Order date */}
            <p className="text-sm text-stone-500 mt-1">
              {t('orderHistory.orderDate')}: {orderDate}
            </p>

            {/* Pickup date */}
            {pickupDate && (
              <div className="flex items-center gap-2 mt-2 text-sm text-stone-600">
                <Calendar className="w-4 h-4 text-gold-500" />
                <span>{pickupDate}</span>
                {order.pickup_time_slot && (
                  <>
                    <Clock className="w-4 h-4 text-gold-500 ms-2" />
                    <span>{order.pickup_time_slot}</span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Total */}
          <div className="text-end">
            <p className="font-semibold text-gold-600 text-lg">
              {order.total_amount.toFixed(2)} ₪
            </p>
            <p className="text-xs text-stone-400">
              {t('orderHistory.itemsCount', { count: itemCount })}
            </p>
          </div>
        </div>

        {/* Expand button */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 flex items-center gap-1 text-sm text-stone-500 hover:text-stone-700 transition-colors"
        >
          {expanded ? (
            <>
              <ChevronUp className="w-4 h-4" />
              {t('common.close')}
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              {t('orderHistory.items')}
            </>
          )}
        </button>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="border-t border-cream-200 p-4 sm:p-5 bg-cream-50/50">
          {/* Items */}
          <div className="space-y-2">
            {order.items?.map((item) => (
              <div
                key={item.id}
                className="flex justify-between text-sm py-1"
              >
                <span className="text-stone-700">
                  {lang === 'he' ? item.product_name_he : item.product_name_fr}
                  <span className="text-stone-400 ms-1">x{item.quantity}</span>
                </span>
                <span className="font-medium text-stone-600">
                  {(item.unit_price * item.quantity).toFixed(2)} ₪
                </span>
              </div>
            ))}
          </div>

          {/* Delivery info */}
          {order.delivery_address && (
            <div className="mt-3 pt-3 border-t border-cream-200">
              <p className="text-sm text-stone-500">
                {t('checkout.delivery')}: {order.delivery_address}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="border-t border-cream-200 p-4 sm:p-5 bg-cream-50/30">
        <button
          onClick={() => onReorder(order)}
          disabled={isReordering}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5
            bg-gold-500 text-white font-medium rounded-lg
            hover:bg-gold-600 disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isReordering ? 'animate-spin' : ''}`} />
          {t('orderHistory.reorder')}
        </button>
      </div>
    </div>
  );
}
