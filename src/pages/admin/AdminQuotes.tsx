import { Card } from '../../components/ui/Card';
import { QuoteRow } from '../../components/admin/QuoteRow';
import { Spinner } from '../../components/ui/Spinner';
import { useQuotes, useUpdateQuoteStatus } from '../../hooks/useQuotes';
import type { QuoteStatus } from '../../types';

export function AdminQuotes() {
  const { data: quotes, isLoading } = useQuotes();
  const updateStatus = useUpdateQuoteStatus();

  const handleStatusChange = (id: string, status: QuoteStatus) => {
    updateStatus.mutate({ id, status });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-gray-900">Quote Requests</h1>
        <p className="text-gray-500 mt-1">Manage event catering inquiries</p>
      </div>

      <Card padding="none" hover={false}>
        {isLoading ? (
          <div className="flex justify-center py-12"><Spinner size="lg" /></div>
        ) : quotes?.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No quote requests yet</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-start px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Contact</th>
                <th className="text-start px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Event</th>
                <th className="text-start px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Details</th>
                <th className="text-start px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-start px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {quotes?.map((quote) => (
                <QuoteRow key={quote.id} quote={quote} onStatusChange={handleStatusChange} />
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
