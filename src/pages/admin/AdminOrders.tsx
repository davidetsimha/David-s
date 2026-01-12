import { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
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

  const counts = {
    all: orders?.length ?? 0,
    pending: orders?.filter(o => o.status === 'pending').length ?? 0,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Commandes</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {counts.all} commande{counts.all > 1 ? 's' : ''}
          {counts.pending > 0 && ` dont ${counts.pending} en attente`}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-lg w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(tab.status)}
            className={`
              px-4 py-2 text-sm font-medium rounded-md transition-all
              ${activeTab === tab.status
                ? 'bg-white text-gray-900 shadow-soft'
                : 'text-gray-600 hover:text-gray-900'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <Card padding="none">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : orders?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <ShoppingBag className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-900">Aucune commande</p>
            <p className="text-sm text-gray-500 mt-1">
              {activeTab ? `Aucune commande ${activeTab === 'pending' ? 'en attente' : activeTab}` : 'Les commandes apparaitront ici'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-start px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Commande</th>
                  <th className="text-start px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Client</th>
                  <th className="text-start px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="text-start px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
                  <th className="text-start px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders?.map((order) => (
                  <OrderRow key={order.id} order={order} onView={setSelectedOrder} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <OrderDetails
        order={selectedOrder}
        open={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
