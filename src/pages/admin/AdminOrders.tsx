import { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { OrderRow } from '../../components/admin/OrderRow';
import { OrderDetails } from '../../components/admin/OrderDetails';
import { Spinner } from '../../components/ui/Spinner';
import { useOrders, useUpdateOrderStatus } from '../../hooks/useOrders';
import type { Order, OrderStatus } from '../../types';

const tabs: { label: string; status?: OrderStatus }[] = [
  { label: 'Toutes' },
  { label: 'En attente', status: 'pending' },
  { label: 'Confirmees', status: 'confirmed' },
  { label: 'Terminees', status: 'completed' },
  { label: 'Annulees', status: 'cancelled' },
];

export function AdminOrders() {
  const [activeTab, setActiveTab] = useState<OrderStatus | undefined>();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const { data: orders, isLoading } = useOrders(activeTab);
  const updateStatus = useUpdateOrderStatus();

  const handleStatusChange = (id: string, status: OrderStatus) => {
    updateStatus.mutate({ id, status }, {
      onSuccess: () => setSelectedOrder(null),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-gray-900">Commandes</h1>
        <p className="text-gray-500 mt-1">Suivez et gerez les commandes clients</p>
      </div>

      <div className="flex gap-2 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(tab.status)}
            className={`px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors
              ${activeTab === tab.status
                ? 'border-gold-500 text-gold-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <Card padding="none" hover={false}>
        {isLoading ? (
          <div className="flex justify-center py-12"><Spinner size="lg" /></div>
        ) : orders?.length === 0 ? (
          <div className="text-center py-12 text-gray-500">Aucune commande trouvee</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-start px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Commande</th>
                <th className="text-start px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Client</th>
                <th className="text-start px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                <th className="text-start px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Statut</th>
                <th className="text-start px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Total</th>
                <th className="w-16"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders?.map((order) => (
                <OrderRow key={order.id} order={order} onView={setSelectedOrder} />
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <OrderDetails order={selectedOrder} open={!!selectedOrder} onClose={() => setSelectedOrder(null)} onStatusChange={handleStatusChange} />
    </div>
  );
}
