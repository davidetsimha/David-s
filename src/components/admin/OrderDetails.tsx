import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { MapPin, Phone, Mail, Package, Calendar, Clock, AlertTriangle, Check, X } from 'lucide-react';
import type { Order, OrderStatus, ConfirmationStatus } from '../../types';

interface OrderDetailsProps {
  order: Order | null;
  open: boolean;
  onClose: () => void;
  onStatusChange: (id: string, status: OrderStatus) => void;
  onConfirmPlateau?: (id: string, paymentLink: string, adminNotes?: string) => void;
  onRejectPlateau?: (id: string, reason: string) => void;
  isConfirming?: boolean;
  isRejecting?: boolean;
}

const statusActions: Record<OrderStatus, OrderStatus | null> = {
  pending: 'confirmed',
  confirmed: 'completed',
  completed: null,
  cancelled: null,
};

const statusLabels: Record<OrderStatus, string> = {
  pending: 'en attente',
  confirmed: 'confirmee',
  completed: 'terminee',
  cancelled: 'annulee',
};

const confirmationStatusLabels: Record<ConfirmationStatus, string> = {
  not_required: 'Non requis',
  pending_confirmation: 'En attente de confirmation',
  confirmed: 'Confirmee',
  rejected: 'Refusee',
};

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
  const [showConfirmForm, setShowConfirmForm] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [paymentLink, setPaymentLink] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [rejectReason, setRejectReason] = useState('');

  if (!order) return null;

  const nextStatus = statusActions[order.status];
  const isPlateau = order.order_type === 'plateau';
  const isPendingConfirmation = order.confirmation_status === 'pending_confirmation';

  const date = new Date(order.created_at).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const pickupDate = order.pickup_date
    ? new Date(order.pickup_date).toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      })
    : null;

  const handleConfirm = () => {
    if (paymentLink && onConfirmPlateau) {
      onConfirmPlateau(order.id, paymentLink, adminNotes || undefined);
      setShowConfirmForm(false);
      setPaymentLink('');
      setAdminNotes('');
    }
  };

  const handleReject = () => {
    if (rejectReason && onRejectPlateau) {
      onRejectPlateau(order.id, rejectReason);
      setShowRejectForm(false);
      setRejectReason('');
    }
  };

  const handleClose = () => {
    setShowConfirmForm(false);
    setShowRejectForm(false);
    setPaymentLink('');
    setAdminNotes('');
    setRejectReason('');
    onClose();
  };

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
            <Input
              label="Lien de paiement"
              value={paymentLink}
              onChange={(e) => setPaymentLink(e.target.value)}
              placeholder="https://..."
              required
            />
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
            <Button onClick={() => onStatusChange(order.id, nextStatus)} className="w-full">
              Marquer comme {statusLabels[nextStatus]}
            </Button>
          )
        )}
      </div>
    </Modal>
  );
}
