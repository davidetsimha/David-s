import { AlertTriangle } from 'lucide-react'
import type { OrderType, PaymentStatus } from '@/types'

interface PaymentBadgeProps {
  paymentStatus?: PaymentStatus | null
  paymentTransactionId?: string | null
  orderType: OrderType
  size?: 'sm' | 'md'
}

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
}

export function PaymentBadge({ paymentStatus, paymentTransactionId, orderType, size = 'md' }: PaymentBadgeProps) {
  // Plateau orders are paid out-of-band (WhatsApp payment link) - no payment_status
  // yet is expected, not a bug, so no badge.
  if (orderType === 'plateau' && !paymentStatus) {
    return null
  }

  const sizeClass = sizes[size]
  const base = `inline-flex items-center gap-1.5 rounded-full font-medium border ${sizeClass}`

  if (paymentStatus === 'approved' && paymentTransactionId) {
    return (
      <span className={`${base} bg-emerald-50 text-emerald-700 border-emerald-200/60`}>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
        Payé
      </span>
    )
  }

  if (paymentStatus === 'declined' || paymentStatus === 'error') {
    return (
      <span className={`${base} bg-red-50 text-red-600 border-red-200/60`}>
        <AlertTriangle className="w-3 h-3" />
        {paymentStatus === 'declined' ? 'Paiement refusé' : 'Erreur de paiement'}
      </span>
    )
  }

  if (paymentStatus === 'amount_mismatch') {
    return (
      <span className={`${base} bg-red-50 text-red-600 border-red-200/60`}>
        <AlertTriangle className="w-3 h-3" />
        Montant incorrect
      </span>
    )
  }

  if (paymentStatus === 'verification_pending') {
    return (
      <span className={`${base} bg-amber-50 text-amber-700 border-amber-200/60`}>
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" aria-hidden="true" />
        Vérification en cours
      </span>
    )
  }

  // null / 'pending' with no transaction id: normal mid-checkout / not-yet-paid state
  return (
    <span className={`${base} bg-gray-50 text-gray-500 border-gray-200/60`}>
      <span className="w-1.5 h-1.5 rounded-full bg-gray-400" aria-hidden="true" />
      Paiement en attente
    </span>
  )
}
