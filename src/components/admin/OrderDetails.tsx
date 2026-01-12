import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { MapPin, Phone, Mail, Package } from 'lucide-react';
import type { Order, OrderStatus } from '../../types';

interface OrderDetailsProps {
  order: Order | null;
  open: boolean;
  onClose: () => void;
  onStatusChange: (id: string, status: OrderStatus) => void;
}

const statusActions: Record<OrderStatus, OrderStatus | null> = {
  pending: 'confirmed',
  confirmed: 'completed',
  completed: null,
  cancelled: null,
};

export function OrderDetails({ order, open, onClose, onStatusChange }: OrderDetailsProps) {
  if (!order) return null;

  const nextStatus = statusActions[order.status];
  const date = new Date(order.created_at).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const statusLabels: Record<OrderStatus, string> = {
    pending: 'en attente',
    confirmed: 'confirmee',
    completed: 'terminee',
    cancelled: 'annulee',
  };

  return (
    <Modal open={open} onClose={onClose} title={`Commande #${order.id.slice(0, 8)}`}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Badge status={order.status}>{statusLabels[order.status]}</Badge>
          <span className="text-sm text-gray-500">{date}</span>
        </div>

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
        </div>

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

        {nextStatus && (
          <Button onClick={() => onStatusChange(order.id, nextStatus)} className="w-full">
            Marquer comme {statusLabels[nextStatus]}
          </Button>
        )}
      </div>
    </Modal>
  );
}
