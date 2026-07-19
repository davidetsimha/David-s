'use client'

import { Badge } from '@/components/ui/Badge'
import { PaymentBadge } from '@/components/ui/PaymentBadge'
import { Eye, Calendar, Clock, Truck, Store } from 'lucide-react'
import type { Order } from '@/types'

interface OrderRowProps {
  order: Order
  onView: (order: Order) => void
  showPickupDate?: boolean
}

export function OrderRow({ order, onView, showPickupDate }: OrderRowProps) {
  const date = new Date(order.created_at).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  const pickupDate = order.pickup_date
    ? new Date(order.pickup_date).toLocaleDateString('fr-FR', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      })
    : null

  const isPlateau = order.order_type === 'plateau'
  const isPendingConfirmation = order.confirmation_status === 'pending_confirmation'
  const isDelivery = order.delivery_type === 'delivery'

  return (
    <tr className={`hover:bg-gray-50/50 transition-colors ${isPendingConfirmation ? 'bg-amber-50/30' : ''}`}>
      <td className="px-4 py-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-sm text-gray-500">#{order.id.slice(0, 8)}</span>
          {isPlateau && (
            <span className="text-xs px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded font-medium">
              Plateau
            </span>
          )}
          {order.is_late_order && (
            <span className="text-xs px-1.5 py-0.5 bg-red-100 text-red-700 rounded font-medium">
              Tardive
            </span>
          )}
        </div>
        <div className="md:hidden mt-2 space-y-1">
          <p className="text-sm font-medium text-gray-900">{order.customer_name}</p>
          <p className="text-xs text-gray-500">{order.customer_email}</p>
          <p className="text-xs text-gray-500">{date}</p>
          <div className="flex items-center gap-2 pt-0.5 flex-wrap">
            {isDelivery ? (
              <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                <Truck className="w-3 h-3" /> Livraison
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
                <Store className="w-3 h-3" /> Retrait
              </span>
            )}
            {showPickupDate && pickupDate && (
              <span className="inline-flex items-center gap-1 text-xs text-gray-600">
                <Calendar className="w-3 h-3" /> {pickupDate}
                {order.pickup_time_slot && (
                  <span className="flex items-center gap-0.5">
                    <Clock className="w-3 h-3" /> {order.pickup_time_slot}
                  </span>
                )}
              </span>
            )}
          </div>
          <div className="pt-1">
            <PaymentBadge
              paymentStatus={order.payment_status}
              paymentTransactionId={order.payment_transaction_id}
              orderType={order.order_type}
              size="sm"
            />
          </div>
        </div>
      </td>
      <td className="px-4 py-4 hidden md:table-cell">
        <div>
          <p className="font-medium text-gray-900">{order.customer_name}</p>
          <p className="text-sm text-gray-500">{order.customer_email}</p>
        </div>
      </td>
      <td className="px-4 py-4 text-sm text-gray-600 hidden md:table-cell">{date}</td>
      {showPickupDate && (
        <td className="px-4 py-4 hidden sm:table-cell">
          {pickupDate ? (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="font-medium text-gray-900">{pickupDate}</span>
              {order.pickup_time_slot && (
                <span className="text-gray-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {order.pickup_time_slot}
                </span>
              )}
            </div>
          ) : (
            <span className="text-gray-400 text-sm">Non definie</span>
          )}
        </td>
      )}
      <td className="px-4 py-4 hidden sm:table-cell">
        {isDelivery ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full bg-purple-100 text-purple-700">
            <Truck className="w-3 h-3" /> Livraison
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full bg-stone-100 text-stone-600">
            <Store className="w-3 h-3" /> Retrait
          </span>
        )}
      </td>
      <td className="px-4 py-4">
        <div className="flex flex-col gap-1.5 items-start">
          <Badge status={order.status}>{order.status}</Badge>
          <PaymentBadge
            paymentStatus={order.payment_status}
            paymentTransactionId={order.payment_transaction_id}
            orderType={order.order_type}
            size="sm"
          />
        </div>
      </td>
      <td className="px-4 py-4 font-medium text-gray-900">
        {order.total_amount.toFixed(2)} ILS
      </td>
      <td className="px-4 py-4">
        <button
          onClick={() => onView(order)}
          className="p-2 rounded-lg text-gray-400 hover:text-gold-600 hover:bg-gold-50 transition-colors"
        >
          <Eye className="w-5 h-5" />
        </button>
      </td>
    </tr>
  )
}
