import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Phone, Mail, Calendar, Users, MessageSquare } from 'lucide-react';
import type { QuoteRequest, QuoteStatus } from '../../types';

interface QuoteDetailsProps {
  quote: QuoteRequest | null;
  open: boolean;
  onClose: () => void;
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

const statusFlow: Record<QuoteStatus, QuoteStatus | null> = {
  new: 'contacted',
  contacted: 'quoted',
  quoted: 'confirmed',
  confirmed: null,
  rejected: null,
};

export function QuoteDetails({ quote, open, onClose, onStatusChange }: QuoteDetailsProps) {
  if (!quote) return null;

  const nextStatus = statusFlow[quote.status];
  const date = new Date(quote.created_at).toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
  const eventDate = new Date(quote.event_date).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <Modal open={open} onClose={onClose} title={`Quote #${quote.id.slice(0, 8)}`}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Badge status={statusMap[quote.status]}>{quote.status}</Badge>
          <span className="text-sm text-gray-500">{date}</span>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg space-y-2">
          <p className="font-medium text-gray-900">{quote.name}</p>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Mail className="w-4 h-4" /> {quote.email}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="w-4 h-4" /> {quote.phone}
          </div>
        </div>

        <div className="p-4 bg-gold-50 rounded-lg space-y-2">
          <h4 className="font-semibold text-gray-900">{eventLabels[quote.event_type] || quote.event_type}</h4>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {eventDate}</span>
            <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {quote.guest_count} guests</span>
          </div>
        </div>

        {quote.message && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> Message
            </h4>
            <p className="text-gray-600 text-sm whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">{quote.message}</p>
          </div>
        )}

        <div className="flex gap-3">
          {nextStatus && (
            <Button onClick={() => onStatusChange(quote.id, nextStatus)} className="flex-1">
              Mark as {nextStatus}
            </Button>
          )}
          {quote.status !== 'rejected' && quote.status !== 'confirmed' && (
            <Button variant="outline" onClick={() => onStatusChange(quote.id, 'rejected')} className="text-red-600 border-red-200 hover:bg-red-50">
              Reject
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
