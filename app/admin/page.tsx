'use client'

import { useOrders } from '@/hooks/useOrders'
import { useQuotes } from '@/hooks/useQuotes'
import { ShoppingBag, MessageSquare, TrendingUp, Clock, BarChart3 } from 'lucide-react'

export default function AdminDashboard() {
  const { data: orders, isLoading: ordersLoading } = useOrders()
  const { data: quotes, isLoading: quotesLoading } = useQuotes()

  const isLoading = ordersLoading || quotesLoading

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const pendingOrders = orders?.filter(o => o.status === 'pending').length ?? 0
  const newQuotes = quotes?.filter(q => q.status === 'new').length ?? 0
  const totalRevenue = orders?.reduce((sum, o) => sum + (o.total_amount || 0), 0) ?? 0

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS' }).format(price)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-500 mt-1">Vue d'ensemble de votre activite</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-semibold text-gray-900">{pendingOrders}</p>
          <p className="text-sm text-gray-500 mt-1">Commandes en attente</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-semibold text-gray-900">{newQuotes}</p>
          <p className="text-sm text-gray-500 mt-1">Nouveaux devis</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-semibold text-gray-900">{orders?.length ?? 0}</p>
          <p className="text-sm text-gray-500 mt-1">Total commandes</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-semibold text-gray-900">{quotes?.length ?? 0}</p>
          <p className="text-sm text-gray-500 mt-1">Total devis</p>
        </div>
      </div>

      {/* Simple stats section instead of charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg font-semibold text-gray-900">Chiffre d'affaires</h2>
          </div>
          <p className="text-3xl font-bold text-gray-900">{formatPrice(totalRevenue)}</p>
          <p className="text-sm text-gray-500 mt-1">Total des commandes</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg font-semibold text-gray-900">Statistiques</h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Commandes confirmees</span>
              <span className="font-medium">{orders?.filter(o => o.status === 'confirmed').length ?? 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Commandes terminees</span>
              <span className="font-medium">{orders?.filter(o => o.status === 'completed').length ?? 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Devis confirmes</span>
              <span className="font-medium">{quotes?.filter(q => q.status === 'confirmed').length ?? 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
