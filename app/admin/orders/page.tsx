'use client'

import { useState } from 'react'
import { ShoppingBag, Clock, AlertCircle } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { OrderRow } from '../components/OrderRow'
import { OrderDetails } from '../components/OrderDetails'
import { Spinner } from '@/components/ui/Spinner'
import {
  useOrders,
  useUpdateOrderStatus,
  useOrdersByConfirmationStatus,
  useConfirmPlateauOrder,
  useRejectPlateauOrder,
} from '@/hooks/useOrders'
import type { Order, OrderStatus } from '@/types'

type TabType = 'all' | 'pending_confirmation' | OrderStatus

const tabs: { label: string; tab: TabType; icon?: React.ReactNode }[] = [
  { label: 'Toutes', tab: 'all' },
  { label: 'A confirmer', tab: 'pending_confirmation', icon: <AlertCircle className="w-4 h-4" /> },
  { label: 'En attente', tab: 'pending' },
  { label: 'Confirmees', tab: 'confirmed' },
  { label: 'Terminees', tab: 'completed' },
  { label: 'Annulees', tab: 'cancelled' },
]

export default function AdminOrders() {
  const [activeTab, setActiveTab] = useState<TabType>('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  // Get orders based on active tab
  const orderStatusFilter = activeTab === 'all' || activeTab === 'pending_confirmation'
    ? undefined
    : activeTab
  const { data: orders, isLoading } = useOrders(orderStatusFilter)

  // Get plateau orders pending confirmation
  const { data: pendingConfirmationOrders } = useOrdersByConfirmationStatus('pending_confirmation')

  const updateStatus = useUpdateOrderStatus()
  const confirmPlateau = useConfirmPlateauOrder()
  const rejectPlateau = useRejectPlateauOrder()

  const handleStatusChange = (id: string, status: OrderStatus) => {
    updateStatus.mutate({ id, status }, {
      onSuccess: () => setSelectedOrder(null),
    })
  }

  const handleConfirmPlateau = (id: string, paymentLink: string, adminNotes?: string) => {
    confirmPlateau.mutate({ id, paymentLink, adminNotes }, {
      onSuccess: () => setSelectedOrder(null),
    })
  }

  const handleRejectPlateau = (id: string, reason: string) => {
    rejectPlateau.mutate({ id, reason }, {
      onSuccess: () => setSelectedOrder(null),
    })
  }

  // Determine which orders to display
  const displayedOrders = activeTab === 'pending_confirmation'
    ? pendingConfirmationOrders
    : orders

  const counts = {
    all: orders?.length ?? 0,
    pending: orders?.filter(o => o.status === 'pending').length ?? 0,
    pendingConfirmation: pendingConfirmationOrders?.length ?? 0,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Commandes</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {counts.all} commande{counts.all > 1 ? 's' : ''}
          {counts.pending > 0 && ` dont ${counts.pending} en attente`}
          {counts.pendingConfirmation > 0 && (
            <span className="text-amber-600 font-medium">
              {' '}- {counts.pendingConfirmation} plateau(x) a confirmer
            </span>
          )}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-lg w-fit overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(tab.tab)}
            className={`
              px-4 py-2 text-sm font-medium rounded-md transition-all whitespace-nowrap
              flex items-center gap-2
              ${activeTab === tab.tab
                ? 'bg-white text-gray-900 shadow-soft'
                : 'text-gray-600 hover:text-gray-900'
              }
              ${tab.tab === 'pending_confirmation' && counts.pendingConfirmation > 0
                ? 'text-amber-600'
                : ''
              }
            `}
          >
            {tab.icon}
            {tab.label}
            {tab.tab === 'pending_confirmation' && counts.pendingConfirmation > 0 && (
              <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">
                {counts.pendingConfirmation}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <Card padding="none">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : displayedOrders?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              {activeTab === 'pending_confirmation' ? (
                <Clock className="w-6 h-6 text-gray-400" />
              ) : (
                <ShoppingBag className="w-6 h-6 text-gray-400" />
              )}
            </div>
            <p className="text-sm font-medium text-gray-900">
              {activeTab === 'pending_confirmation'
                ? 'Aucun plateau a confirmer'
                : 'Aucune commande'
              }
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {activeTab === 'pending_confirmation'
                ? 'Les commandes de plateaux en attente de confirmation apparaitront ici'
                : activeTab && activeTab !== 'all'
                  ? `Aucune commande ${activeTab === 'pending' ? 'en attente' : activeTab}`
                  : 'Les commandes apparaitront ici'
              }
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
                  {activeTab === 'pending_confirmation' && (
                    <th className="text-start px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Retrait</th>
                  )}
                  <th className="text-start px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Mode</th>
                  <th className="text-start px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
                  <th className="text-start px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {displayedOrders?.map((order) => (
                  <OrderRow
                    key={order.id}
                    order={order}
                    onView={setSelectedOrder}
                    showPickupDate={activeTab === 'pending_confirmation'}
                  />
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
        onConfirmPlateau={handleConfirmPlateau}
        onRejectPlateau={handleRejectPlateau}
        isConfirming={confirmPlateau.isPending}
        isRejecting={rejectPlateau.isPending}
      />
    </div>
  )
}
