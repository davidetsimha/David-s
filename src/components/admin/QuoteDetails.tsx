import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';
import { Phone, Mail, Calendar, Users, MessageSquare, FileText } from 'lucide-react';
import { useUpdateQuoteNotes } from '../../hooks/useQuotes';
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
  brit: 'Brit Mila',
  private_party: 'Fete privee',
};

const statusLabels: Record<QuoteStatus, string> = {
  new: 'nouveau',
  contacted: 'contacte',
  quoted: 'devis envoye',
  confirmed: 'confirme',
  rejected: 'rejete',
};

const statusFlow: Record<QuoteStatus, QuoteStatus | null> = {
  new: 'contacted',
  contacted: 'quoted',
  quoted: 'confirmed',
  confirmed: null,
  rejected: null,
};

export function QuoteDetails({ quote, open, onClose, onStatusChange }: QuoteDetailsProps) {
  const [adminNotes, setAdminNotes] = useState('');
  const updateNotes = useUpdateQuoteNotes();

  useEffect(() => {
    if (quote) {
      setAdminNotes(quote.admin_notes || '');
    }
  }, [quote]);

  if (!quote) return null;

  const nextStatus = statusFlow[quote.status];
  const date = new Date(quote.created_at).toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
  const eventDate = new Date(quote.event_date).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  const handleSaveNotes = () => {
    updateNotes.mutate({ id: quote.id, notes: adminNotes });
  };

  const hasNotesChanged = adminNotes !== (quote.admin_notes || '');

  return (
    <Modal open={open} onClose={onClose} title={`Devis #${quote.id.slice(0, 8)}`}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Badge status={statusMap[quote.status]}>{statusLabels[quote.status]}</Badge>
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
            <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {quote.guest_count} invites</span>
          </div>
        </div>

        {quote.message && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> Message du client
            </h4>
            <p className="text-gray-600 text-sm whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">{quote.message}</p>
          </div>
        )}

        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4" /> Notes admin
          </h4>
          <Textarea
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            placeholder="Ajoutez des notes internes ici..."
            rows={3}
          />
          {hasNotesChanged && (
            <Button
              onClick={handleSaveNotes}
              loading={updateNotes.isPending}
              size="sm"
              className="mt-2"
            >
              Sauvegarder les notes
            </Button>
          )}
        </div>

        <div className="flex gap-3">
          {nextStatus && (
            <Button onClick={() => onStatusChange(quote.id, nextStatus)} className="flex-1">
              Marquer comme {statusLabels[nextStatus]}
            </Button>
          )}
          {quote.status !== 'rejected' && quote.status !== 'confirmed' && (
            <Button variant="outline" onClick={() => onStatusChange(quote.id, 'rejected')} className="text-red-600 border-red-200 hover:bg-red-50">
              Rejeter
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
