import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Calendar, Users } from 'lucide-react';
import type { QuoteRequest, QuoteStatus } from '../../types';

interface QuoteRowProps {
  quote: QuoteRequest;
  onStatusChange: (id: string, status: QuoteStatus) => void;
}

const statusMap: Record<QuoteStatus, 'pending' | 'confirmed' | 'processing' | 'completed' | 'cancelled'> = {
  new: 'pending',
  contacted: 'processing',
  quoted: 'processing',
  confirmed: 'confirmed',
  rejected: 'cancelled',
};

const eventLabels: Record<string, string> = {
  bar_mitzvah: 'Bar Mitzvah',
  bat_mitzvah: 'Bat Mitzvah',
  brit: 'Brit',
  private_party: 'Private Party',
};

export function QuoteRow({ quote, onStatusChange }: QuoteRowProps) {
  const eventDate = new Date(quote.event_date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <tr className="hover:bg-gray-50/50 transition-colors">
      <td className="px-4 py-4">
        <div>
          <p className="font-medium text-gray-900">{quote.name}</p>
          <p className="text-sm text-gray-500">{quote.email}</p>
        </div>
      </td>
      <td className="px-4 py-4">
        <span className="text-sm font-medium text-gray-700">
          {eventLabels[quote.event_type] || quote.event_type}
        </span>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" /> {eventDate}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" /> {quote.guest_count}
          </span>
        </div>
      </td>
      <td className="px-4 py-4">
        <Badge status={statusMap[quote.status]}>{quote.status}</Badge>
      </td>
      <td className="px-4 py-4">
        <div className="flex gap-2">
          {quote.status === 'new' && (
            <Button size="sm" variant="outline" onClick={() => onStatusChange(quote.id, 'contacted')}>
              Mark Contacted
            </Button>
          )}
          {quote.status === 'contacted' && (
            <Button size="sm" variant="outline" onClick={() => onStatusChange(quote.id, 'quoted')}>
              Send Quote
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
}
