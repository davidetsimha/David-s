'use client'

import { ShoppingBag, MessageSquare, DollarSign, TrendingUp, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { StatsCard } from './components/StatsCard'
import { Badge } from '@/components/ui/Badge'
import { Card, CardTitle } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'
import { PushNotificationToggle } from './components/PushNotificationToggle'
import { useOrders } from '@/hooks/useOrders'
import { useQuotes } from '@/hooks/useQuotes'
import { RevenueChart, TopProductsChart, ConversionStats, EventTypeChart } from './components/charts'
import type { Order, QuoteRequest } from '@/types'

export default function AdminDashboard() {
  const { data: orders, isLoading: ordersLoading } = useOrders()
  const { data: quotes, isLoading: quotesLoading } = useQuotes()

  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const todayOrders = orders?.filter((o) => {
    return new Date(o.created_at).toDateString() === today.toDateString()
  }) ?? []

  const yesterdayOrders = orders?.filter((o) => {
    return new Date(o.created_at).toDateString() === yesterday.toDateString()
  }) ?? []

  const pendingQuotes = quotes?.filter((q) => q.status === 'new') ?? []
  const todayRevenue = todayOrders.reduce((sum, o) => sum + o.total_amount, 0)
  const yesterdayRevenue = yesterdayOrders.reduce((sum, o) => sum + o.total_amount, 0)
  const recentOrders = orders?.slice(0, 5) ?? []

  const ordersTrend = yesterdayOrders.length > 0
    ? Math.round(((todayOrders.length - yesterdayOrders.length) / yesterdayOrders.length) * 100)
    : todayOrders.length > 0 ? 100 : 0

  const revenueTrend = yesterdayRevenue > 0
    ? Math.round(((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100)
    : todayRevenue > 0 ? 100 : 0

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Tableau de bord</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {today.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
      </div>

      {/* Push Notifications Toggle */}
      <PushNotificationToggle />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={<ShoppingBag className="w-5 h-5" />}
          label="Commandes du jour"
          value={todayOrders.length}
          trend={ordersTrend !== 0 ? { value: ordersTrend, label: 'vs hier' } : undefined}
        />
        <StatsCard
          icon={<MessageSquare className="w-5 h-5" />}
          label="Devis en attente"
          value={pendingQuotes.length}
        />
        <StatsCard
          icon={<DollarSign className="w-5 h-5" />}
          label="CA du jour"
          value={`${todayRevenue.toFixed(0)} ₪`}
          trend={revenueTrend !== 0 ? { value: revenueTrend, label: 'vs hier' } : undefined}
        />
        <StatsCard
          icon={<TrendingUp className="w-5 h-5" />}
          label="Total commandes"
          value={orders?.length ?? 0}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card padding="none" className="overflow-hidden">
          <RevenueChart />
        </Card>
        <Card padding="none" className="overflow-hidden">
          <TopProductsChart />
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card padding="none" className="overflow-hidden">
          <ConversionStats />
        </Card>
        <Card padding="none" className="overflow-hidden">
          <EventTypeChart />
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Orders */}
        <Card padding="none">
          <div className="p-4 flex items-center justify-between border-b border-gray-50">
            <CardTitle>Commandes recentes</CardTitle>
            <Link
              href="/admin/orders"
              className="text-sm text-gold-600 hover:text-gold-700 font-medium inline-flex items-center gap-1"
            >
              Voir tout <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {ordersLoading ? (
            <div className="flex items-center justify-center py-8">
              <Spinner />
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-500">
              Aucune commande
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentOrders.map((order: Order) => (
                <div key={order.id} className="px-4 py-3 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                      <ShoppingBag className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{order.customer_name}</p>
                      <p className="text-xs text-gray-500">{formatDate(order.created_at)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <Badge status={order.status} size="sm">{order.status}</Badge>
                    <span className="text-sm font-medium text-gray-900">{order.total_amount.toFixed(0)} ₪</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Pending Quotes */}
        <Card padding="none">
          <div className="p-4 flex items-center justify-between border-b border-gray-50">
            <CardTitle>Devis en attente</CardTitle>
            <Link
              href="/admin/quotes"
              className="text-sm text-gold-600 hover:text-gold-700 font-medium inline-flex items-center gap-1"
            >
              Voir tout <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {quotesLoading ? (
            <div className="flex items-center justify-center py-8">
              <Spinner />
            </div>
          ) : pendingQuotes.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-500">
              Aucun devis en attente
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {pendingQuotes.slice(0, 5).map((quote: QuoteRequest) => (
                <div key={quote.id} className="px-4 py-3 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-gold-50 flex items-center justify-center shrink-0">
                      <MessageSquare className="w-4 h-4 text-gold-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{quote.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{quote.event_type.replace('_', ' ')}</p>
                    </div>
                  </div>
                  <div className="text-end shrink-0">
                    <p className="text-sm font-medium text-gray-900">{quote.guest_count} invites</p>
                    <p className="text-xs text-gray-500">{formatDate(quote.created_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
