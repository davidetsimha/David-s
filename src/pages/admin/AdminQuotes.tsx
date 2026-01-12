import { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { QuoteRow } from '../../components/admin/QuoteRow';
import { QuoteDetails } from '../../components/admin/QuoteDetails';
import { Spinner } from '../../components/ui/Spinner';
import { useQuotes, useUpdateQuoteStatus } from '../../hooks/useQuotes';
import type { QuoteRequest, QuoteStatus } from '../../types';

export function AdminQuotes() {
  const { data: quotes, isLoading } = useQuotes();
  const updateStatus = useUpdateQuoteStatus();
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);

  const handleStatusChange = (id: string, status: QuoteStatus) => {
    updateStatus.mutate({ id, status });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl lg:text-3xl text-gray-900">Demandes de devis</h1>
        <p className="text-gray-500 mt-1">Gerez les demandes de traiteur pour evenements</p>
      </div>

      <Card padding="none" hover={false}>
        {isLoading ? (
          <div className="flex justify-center py-12"><Spinner size="lg" /></div>
        ) : quotes?.length === 0 ? (
          <div className="text-center py-12 text-gray-500">Aucune demande de devis</div>
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
  );
}
