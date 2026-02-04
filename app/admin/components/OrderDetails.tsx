'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { MapPin, Phone, Mail, Package, Calendar, Clock, AlertTriangle, Check, X, MessageCircle, Link as LinkIcon, Loader2 } from 'lucide-react'
import type { Order, OrderStatus, ConfirmationStatus } from '@/types'

// Format phone number for WhatsApp (Israeli format)
function formatPhoneForWhatsApp(phone: string): string {
  // Clean the number (remove spaces, dashes, parentheses)
  let cleaned = phone.replace(/[\s\-\(\)]/g, '')

  // If starts with +, remove the +
  if (cleaned.startsWith('+')) {
    cleaned = cleaned.substring(1)
  }

  // If starts with 0 (local Israeli format), replace with 972
  if (cleaned.startsWith('0')) {
    cleaned = '972' + cleaned.substring(1)
  }

  return cleaned
}

type WhatsAppLanguage = 'fr' | 'he'
type LastAction = 'confirmed' | 'rejected' | 'individual_confirmed' | null

interface OrderDetailsProps {
  order: Order | null
  open: boolean
  onClose: () => void
  onStatusChange: (id: string, status: OrderStatus) => void
  onConfirmPlateau?: (id: string, paymentLink: string, adminNotes?: string) => void
  onRejectPlateau?: (id: string, reason: string) => void
  isConfirming?: boolean
  isRejecting?: boolean
}

const statusActions: Record<OrderStatus, OrderStatus | null> = {
  pending: 'confirmed',
  confirmed: 'completed',
  completed: null,
  cancelled: null,
}

const statusLabels: Record<OrderStatus, string> = {
  pending: 'en attente',
  confirmed: 'confirmee',
  completed: 'terminee',
  cancelled: 'annulee',
}

const confirmationStatusLabels: Record<ConfirmationStatus, string> = {
  not_required: 'Non requis',
  pending_confirmation: 'En attente de confirmation',
  confirmed: 'Confirmee',
  rejected: 'Refusee',
}

export function OrderDetails({
  order,
  open,
  onClose,
  onStatusChange,
  onConfirmPlateau,
  onRejectPlateau,
  isConfirming,
  isRejecting,
}: OrderDetailsProps) {
  const [showConfirmForm, setShowConfirmForm] = useState(false)
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [paymentLink, setPaymentLink] = useState('')
  const [adminNotes, setAdminNotes] = useState('')
  const [rejectReason, setRejectReason] = useState('')
  const [isGeneratingLink, setIsGeneratingLink] = useState(false)

  // WhatsApp contact states
  const [lastAction, setLastAction] = useState<LastAction>(null)
  const [whatsAppLanguage, setWhatsAppLanguage] = useState<WhatsAppLanguage | null>(null)
  const [savedPaymentLink, setSavedPaymentLink] = useState('')
  const [savedRejectReason, setSavedRejectReason] = useState('')

  if (!order) return null

  const nextStatus = statusActions[order.status]
  const isPlateau = order.order_type === 'plateau'
  const isPendingConfirmation = order.confirmation_status === 'pending_confirmation'

  const date = new Date(order.created_at).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const pickupDate = order.pickup_date
    ? new Date(order.pickup_date).toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      })
    : null

  const handleGeneratePaymentLink = async () => {
    setIsGeneratingLink(true)
    try {
      const response = await fetch('/api/payment/generate-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.id }),
      })

      const data = await response.json()

      if (data.success && data.paymentUrl) {
        setPaymentLink(data.paymentUrl)
      } else {
        alert('Erreur: ' + (data.error || 'Impossible de generer le lien'))
      }
    } catch (error) {
      alert('Erreur reseau')
    } finally {
      setIsGeneratingLink(false)
    }
  }

  const handleConfirm = () => {
    if (paymentLink && onConfirmPlateau) {
      onConfirmPlateau(order.id, paymentLink, adminNotes || undefined)
      // Save payment link and set last action for WhatsApp
      setSavedPaymentLink(paymentLink)
      setLastAction('confirmed')
      setShowConfirmForm(false)
      setPaymentLink('')
      setAdminNotes('')
    }
  }

  const handleReject = () => {
    if (rejectReason && onRejectPlateau) {
      onRejectPlateau(order.id, rejectReason)
      // Save reject reason and set last action for WhatsApp
      setSavedRejectReason(rejectReason)
      setLastAction('rejected')
      setShowRejectForm(false)
      setRejectReason('')
    }
  }

  // Generate WhatsApp message based on action and language
  const getWhatsAppMessage = (lang: WhatsAppLanguage): string => {
    const customerName = order.customer_name
    const pickupDateFormatted = pickupDate || ''
    const totalAmount = order.total_amount.toFixed(2)
    const timeSlot = order.pickup_time_slot || ''

    if (lastAction === 'confirmed') {
      if (lang === 'fr') {
        return `Bonjour ${customerName},

Votre commande de plateau pour le ${pickupDateFormatted} a été confirmée ! 🎉

Voici le lien de paiement :
${savedPaymentLink}

Montant : ${totalAmount} ₪

À bientôt !
David's Patisserie`
      } else {
        return `שלום ${customerName},

ההזמנה שלך ל-${pickupDateFormatted} אושרה! 🎉

קישור לתשלום:
${savedPaymentLink}

סכום: ₪${totalAmount}

להתראות!
David's Patisserie`
      }
    } else if (lastAction === 'rejected') {
      if (lang === 'fr') {
        return `Bonjour ${customerName},

Nous sommes désolés, mais nous ne pouvons pas honorer votre commande pour le ${pickupDateFormatted}.

Raison : ${savedRejectReason}

N'hésitez pas à nous contacter pour discuter d'autres options.

David's Patisserie`
      } else {
        return `שלום ${customerName},

אנו מצטערים, אבל לא נוכל לבצע את ההזמנה שלך ל-${pickupDateFormatted}.

סיבה: ${savedRejectReason}

אתם מוזמנים ליצור קשר לדון באפשרויות אחרות.

David's Patisserie`
      }
    } else if (lastAction === 'individual_confirmed') {
      if (lang === 'fr') {
        return `Bonjour ${customerName},

Votre commande pour le ${pickupDateFormatted}${timeSlot ? ` (${timeSlot})` : ''} est confirmée ! 🎉

Montant : ${totalAmount} ₪

Merci pour votre commande !
David's Patisserie`
      } else {
        return `שלום ${customerName},

ההזמנה שלך ל-${pickupDateFormatted}${timeSlot ? ` (${timeSlot})` : ''} אושרה! 🎉

סכום: ₪${totalAmount}

תודה על ההזמנה!
David's Patisserie`
      }
    }
    return ''
  }

  const getWhatsAppUrl = (lang: WhatsAppLanguage): string => {
    const phone = formatPhoneForWhatsApp(order.customer_phone)
    const message = encodeURIComponent(getWhatsAppMessage(lang))
    return `https://wa.me/${phone}?text=${message}`
  }

  const handleClose = () => {
    setShowConfirmForm(false)
    setShowRejectForm(false)
    setPaymentLink('')
    setAdminNotes('')
    setRejectReason('')
    // Reset WhatsApp states
    setLastAction(null)
    setWhatsAppLanguage(null)
    setSavedPaymentLink('')
    setSavedRejectReason('')
    onClose()
  }

  return (
    <Modal open={open} onClose={handleClose} title={`Commande #${order.id.slice(0, 8)}`}>
      <div className="space-y-6">
        {/* Status badges */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Badge status={order.status}>{statusLabels[order.status]}</Badge>
            {isPlateau && (
              <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded-full font-medium">
                Plateau
              </span>
            )}
            {order.is_late_order && (
              <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full font-medium flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Commande tardive
              </span>
            )}
          </div>
          <span className="text-sm text-gray-500">{date}</span>
        </div>

        {/* Pickup date for plateau orders */}
        {pickupDate && (
          <div className="p-3 bg-blue-50 rounded-lg flex items-center gap-3">
            <Calendar className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-blue-900">Date de retrait</p>
              <p className="text-sm text-blue-700">
                {pickupDate}
                {order.pickup_time_slot && (
                  <span className="ml-2 flex items-center gap-1 inline-flex">
                    <Clock className="w-3 h-3" /> {order.pickup_time_slot}
                  </span>
                )}
              </p>
            </div>
          </div>
        )}

        {/* Confirmation status for plateau orders */}
        {isPlateau && order.confirmation_status !== 'not_required' && (
          <div
            className={`p-3 rounded-lg ${
              order.confirmation_status === 'pending_confirmation'
                ? 'bg-amber-50'
                : order.confirmation_status === 'confirmed'
                  ? 'bg-green-50'
                  : 'bg-red-50'
            }`}
          >
            <p className="text-sm font-medium">
              Confirmation:{' '}
              <span
                className={
                  order.confirmation_status === 'pending_confirmation'
                    ? 'text-amber-700'
                    : order.confirmation_status === 'confirmed'
                      ? 'text-green-700'
                      : 'text-red-700'
                }
              >
                {confirmationStatusLabels[order.confirmation_status]}
              </span>
            </p>
            {order.admin_notes && (
              <p className="text-sm text-gray-600 mt-1">Note: {order.admin_notes}</p>
            )}
            {order.payment_link && (
              <p className="text-sm text-gray-600 mt-1">
                Lien de paiement:{' '}
                <a
                  href={order.payment_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {order.payment_link.substring(0, 40)}...
                </a>
              </p>
            )}
          </div>
        )}

        {/* Customer info */}
        <div className="p-4 bg-gray-50 rounded-lg space-y-2">
          <p className="font-medium text-gray-900">{order.customer_name}</p>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Mail className="w-4 h-4" /> {order.customer_email}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="w-4 h-4" /> {order.customer_phone}
          </div>
          {order.delivery_address && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" /> {order.delivery_address}
            </div>
          )}
          {order.delivery_zone && (
            <div className="text-sm text-gray-600">
              Zone: {order.delivery_zone.name_fr} ({order.delivery_zone.price} ILS)
            </div>
          )}
        </div>

        {/* Items */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Package className="w-4 h-4" /> Articles
          </h4>
          <div className="space-y-2">
            {order.items?.map((item) => (
              <div key={item.id} className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-700">
                  {item.product_name_fr} <span className="text-gray-400">x{item.quantity}</span>
                </span>
                <span className="font-medium">{(item.unit_price * item.quantity).toFixed(2)} ₪</span>
              </div>
            ))}
            <div className="flex justify-between pt-2 font-semibold">
              <span>Total</span>
              <span className="text-gold-600">{order.total_amount.toFixed(2)} ₪</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {order.notes && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700">Notes du client</p>
            <p className="text-sm text-gray-600 mt-1">{order.notes}</p>
          </div>
        )}

        {/* Confirmation form for plateau orders */}
        {isPendingConfirmation && showConfirmForm && (
          <div className="p-4 bg-green-50 rounded-lg space-y-4">
            <h4 className="font-medium text-green-900">Confirmer la commande</h4>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Lien de paiement</label>
              <div className="flex gap-2">
                <Input
                  value={paymentLink}
                  onChange={(e) => setPaymentLink(e.target.value)}
                  placeholder="https://..."
                  className="flex-1"
                />
                <Button
                  variant="secondary"
                  onClick={handleGeneratePaymentLink}
                  disabled={isGeneratingLink}
                  className="shrink-0"
                >
                  {isGeneratingLink ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <LinkIcon className="w-4 h-4" />
                  )}
                  <span className="ml-1">Generer</span>
                </Button>
              </div>
            </div>
            <Textarea
              label="Note (optionnel)"
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Informations supplementaires..."
              rows={2}
            />
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => setShowConfirmForm(false)}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                onClick={handleConfirm}
                loading={isConfirming}
                disabled={!paymentLink}
                className="flex-1"
              >
                <Check className="w-4 h-4" /> Confirmer
              </Button>
            </div>
          </div>
        )}

        {/* Reject form for plateau orders */}
        {isPendingConfirmation && showRejectForm && (
          <div className="p-4 bg-red-50 rounded-lg space-y-4">
            <h4 className="font-medium text-red-900">Refuser la commande</h4>
            <Textarea
              label="Raison du refus"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Expliquez pourquoi la commande ne peut pas etre honoree..."
              rows={3}
              required
            />
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => setShowRejectForm(false)}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                variant="danger"
                onClick={handleReject}
                loading={isRejecting}
                disabled={!rejectReason}
                className="flex-1"
              >
                <X className="w-4 h-4" /> Refuser
              </Button>
            </div>
          </div>
        )}

        {/* WhatsApp Contact Section - shown after confirmation/rejection */}
        {lastAction && (
          <div
            className={`p-4 rounded-lg ${
              lastAction === 'rejected' ? 'bg-red-50' : 'bg-green-50'
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              {lastAction === 'rejected' ? (
                <X className="w-5 h-5 text-red-600" />
              ) : (
                <Check className="w-5 h-5 text-green-600" />
              )}
              <h4
                className={`font-medium ${
                  lastAction === 'rejected' ? 'text-red-900' : 'text-green-900'
                }`}
              >
                {lastAction === 'rejected' ? 'Commande refusée' : 'Commande confirmée'}
              </h4>
            </div>

            <p className="text-sm text-gray-600 mb-3">Contacter le client via WhatsApp:</p>

            {/* Language selection */}
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => setWhatsAppLanguage('fr')}
                className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
                  whatsAppLanguage === 'fr'
                    ? 'bg-blue-100 border-blue-300 text-blue-800'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                🇫🇷 Français
              </button>
              <button
                onClick={() => setWhatsAppLanguage('he')}
                className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
                  whatsAppLanguage === 'he'
                    ? 'bg-blue-100 border-blue-300 text-blue-800'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                🇮🇱 עברית
              </button>
            </div>

            {/* WhatsApp button */}
            {whatsAppLanguage && (
              <a
                href={getWhatsAppUrl(whatsAppLanguage)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                Envoyer via WhatsApp
              </a>
            )}
          </div>
        )}

        {/* Actions */}
        {isPendingConfirmation && !showConfirmForm && !showRejectForm ? (
          <div className="flex gap-3">
            <Button
              variant="danger"
              onClick={() => setShowRejectForm(true)}
              className="flex-1"
            >
              <X className="w-4 h-4" /> Refuser
            </Button>
            <Button onClick={() => setShowConfirmForm(true)} className="flex-1">
              <Check className="w-4 h-4" /> Confirmer
            </Button>
          </div>
        ) : (
          nextStatus &&
          !showConfirmForm &&
          !showRejectForm && (
            <Button
              onClick={() => {
                onStatusChange(order.id, nextStatus)
                // Show WhatsApp section for individual orders when confirming
                if (!isPlateau && nextStatus === 'confirmed') {
                  setLastAction('individual_confirmed')
                }
              }}
              className="w-full"
            >
              Marquer comme {statusLabels[nextStatus]}
            </Button>
          )
        )}
      </div>
    </Modal>
  )
}
