'use client'

import { useState } from 'react'
import { MessageSquare } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { QuoteRow } from '../components/QuoteRow'
import { QuoteDetails } from '../components/QuoteDetails'
import { Spinner } from '@/components/ui/Spinner'
import { useQuotes, useUpdateQuoteStatus } from '@/hooks/useQuotes'
import type { QuoteRequest, QuoteStatus } from '@/types'

export default function AdminQuotes() {
  const { data: quotes, isLoading } = useQuotes()
  const updateStatus = useUpdateQuoteStatus()
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null)

  const handleStatusChange = (id: string, status: QuoteStatus) => {
    updateStatus.mutate({ id, status })
  }

  const pendingCount = quotes?.filter(q => q.status === 'new' || q.status === 'contacted' || q.status === 'quoted').length ?? 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Demandes de devis</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {quotes?.length ?? 0} devis{(quotes?.length ?? 0) > 1 ? '' : ''}
          {pendingCount > 0 && ` dont ${pendingCount} en attente`}
        </p>
      </div>

      <Card padding="none" hover={false}>
        {isLoading ? (
          <div className="flex justify-center py-12"><Spinner size="lg" /></div>
        ) : quotes?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <MessageSquare className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-900">Aucune demande de devis</p>
            <p className="text-sm text-gray-500 mt-1">Les demandes apparaitront ici</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-start px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Contact</th>
                  <th className="text-start px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Evenement</th>
                  <th className="text-start px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Details</th>
                  <th className="text-start px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Statut</th>
                  <th className="text-start px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {quotes?.map((quote) => (
                  <QuoteRow
                    key={quote.id}
                    quote={quote}
                    onStatusChange={handleStatusChange}
                    onViewDetails={() => setSelectedQuote(quote)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <QuoteDetails
        quote={selectedQuote}
        open={!!selectedQuote}
        onClose={() => setSelectedQuote(null)}
        onStatusChange={handleStatusChange}
      />
    </div>
  )
}
