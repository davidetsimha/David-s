'use client'

import { useState } from 'react'
import { useQuotes, useUpdateQuoteStatus } from '@/src/hooks/useQuotes'
import { MessageSquare, Eye, X } from 'lucide-react'
import type { QuoteRequest, QuoteStatus } from '@/src/types'

const statusTabs: { value: QuoteStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Tous' },
  { value: 'new', label: 'Nouveaux' },
  { value: 'contacted', label: 'Contactes' },
  { value: 'quoted', label: 'Devis envoye' },
  { value: 'confirmed', label: 'Confirmes' },
  { value: 'rejected', label: 'Rejetes' },
]

const statusColors: Record<QuoteStatus, string> = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-yellow-100 text-yellow-700',
  quoted: 'bg-purple-100 text-purple-700',
  confirmed: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
}

const statusLabels: Record<QuoteStatus, string> = {
  new: 'Nouveau',
  contacted: 'Contacte',
  quoted: 'Devis envoye',
  confirmed: 'Confirme',
  rejected: 'Rejete',
}

export default function AdminQuotesPage() {
  const [statusFilter, setStatusFilter] = useState<QuoteStatus | 'all'>('all')
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null)

  const { data: quotes = [], isLoading } = useQuotes()
  const updateStatus = useUpdateQuoteStatus()

  const filteredQuotes = statusFilter === 'all'
    ? quotes
    : quotes.filter(q => q.status === statusFilter)

  const handleStatusChange = async (id: string, status: QuoteStatus) => {
    await updateStatus.mutateAsync({ id, status })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Devis</h1>
        <p className="text-gray-500 mt-1">{quotes.length} demandes au total</p>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {statusTabs.map(tab => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              statusFilter === tab.value
                ? 'bg-amber-100 text-amber-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Quotes table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {filteredQuotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <MessageSquare className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-900">Aucun devis</p>
            <p className="text-sm text-gray-500 mt-1">Les demandes de devis apparaitront ici</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-start px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Client</th>
                  <th className="text-start px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Evenement</th>
                  <th className="text-start px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Date</th>
                  <th className="text-start px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
                  <th className="text-start px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredQuotes.map(quote => (
                  <tr key={quote.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-900">{quote.name}</div>
                      <div className="text-xs text-gray-500">{quote.email}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {quote.event_type}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 hidden sm:table-cell">
                      {formatDate(quote.event_date)}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={quote.status}
                        onChange={(e) => handleStatusChange(quote.id, e.target.value as QuoteStatus)}
                        className={`text-xs font-medium rounded-full px-2 py-1 border-0 ${statusColors[quote.status]}`}
                      >
                        <option value="new">Nouveau</option>
                        <option value="contacted">Contacte</option>
                        <option value="quoted">Devis envoye</option>
                        <option value="confirmed">Confirme</option>
                        <option value="rejected">Rejete</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelectedQuote(quote)}
                        className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quote details modal */}
      {selectedQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Details de la demande</h2>
              <button
                onClick={() => setSelectedQuote(null)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 uppercase">Client</p>
                <p className="text-sm font-medium">{selectedQuote.name}</p>
                <p className="text-sm text-gray-500">{selectedQuote.email}</p>
                <p className="text-sm text-gray-500">{selectedQuote.phone}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase">Evenement</p>
                <p className="text-sm font-medium">{selectedQuote.event_type}</p>
                <p className="text-sm text-gray-500">{formatDate(selectedQuote.event_date)}</p>
                <p className="text-sm text-gray-500">{selectedQuote.guest_count} invites</p>
              </div>

              {selectedQuote.message && (
                <div>
                  <p className="text-xs text-gray-500 uppercase">Message</p>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">{selectedQuote.message}</p>
                </div>
              )}

              <div>
                <p className="text-xs text-gray-500 uppercase mb-2">Changer le statut</p>
                <select
                  value={selectedQuote.status}
                  onChange={(e) => handleStatusChange(selectedQuote.id, e.target.value as QuoteStatus)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                >
                  <option value="new">Nouveau</option>
                  <option value="contacted">Contacte</option>
                  <option value="quoted">Devis envoye</option>
                  <option value="confirmed">Confirme</option>
                  <option value="rejected">Rejete</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
