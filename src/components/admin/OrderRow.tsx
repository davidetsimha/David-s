import { Badge } from '../ui/Badge';
import { Eye } from 'lucide-react';
import type { Order } from '../../types';

interface OrderRowProps {
  order: Order;
  onView: (order: Order) => void;
}

export function OrderRow({ order, onView }: OrderRowProps) {
  const date = new Date(order.created_at).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <tr className="hover:bg-gray-50/50 transition-colors">
      <td className="px-4 py-4">
        <span className="font-mono text-sm text-gray-500">#{order.id.slice(0, 8)}</span>
      </td>
      <td className="px-4 py-4">
        <div>
          <p className="font-medium text-gray-900">{order.customer_name}</p>
          <p className="text-sm text-gray-500">{order.customer_email}</p>
        </div>
      </td>
      <td className="px-4 py-4 text-sm text-gray-600">{date}</td>
      <td className="px-4 py-4">
        <Badge status={order.status}>{order.status}</Badge>
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
  );
}
