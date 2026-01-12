import { useState } from 'react';
import { Mail, MailOpen, Trash2, Phone, Calendar, User } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Spinner } from '../../components/ui/Spinner';
import { ConfirmModal } from '../../components/admin/ConfirmModal';
import {
  useContactMessages,
  useMarkMessageAsRead,
  useDeleteContactMessage,
} from '../../hooks/useContact';
import type { ContactMessage } from '../../types';

type FilterType = 'all' | 'unread' | 'read';

export function AdminMessages() {
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const readFilter = filter === 'all' ? undefined : filter === 'read';
  const { data: messages, isLoading } = useContactMessages(readFilter);
  const markAsReadMutation = useMarkMessageAsRead();
  const deleteMutation = useDeleteContactMessage();

  const unreadCount = messages?.filter((m) => !m.read).length ?? 0;

  const openMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
    if (!message.read) {
      markAsReadMutation.mutate({ id: message.id, read: true });
    }
  };

  const toggleRead = (message: ContactMessage, e: React.MouseEvent) => {
    e.stopPropagation();
    markAsReadMutation.mutate({ id: message.id, read: !message.read });
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId, {
        onSuccess: () => {
          setDeleteId(null);
          if (selectedMessage?.id === deleteId) {
            setSelectedMessage(null);
          }
        },
      });
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    const diffDays = diffHours / 24;

    if (diffHours < 24) {
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays < 7) {
      return date.toLocaleDateString('fr-FR', { weekday: 'short', hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    }
  };

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'Tous' },
    { key: 'unread', label: 'Non lus' },
    { key: 'read', label: 'Lus' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {unreadCount > 0 ? `${unreadCount} non lu${unreadCount > 1 ? 's' : ''}` : 'Tous les messages sont lus'}
          </p>
        </div>

        {/* Filter pills */}
        <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
          {filters.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`
                px-4 py-2 text-sm font-medium rounded-md transition-all
                ${filter === key
                  ? 'bg-white text-gray-900 shadow-soft'
                  : 'text-gray-600 hover:text-gray-900'
                }
              `}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Messages List */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : messages?.length === 0 ? (
        <Card className="text-center py-12">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
            <Mail className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-900">Aucun message</p>
          <p className="text-sm text-gray-500 mt-1">
            {filter === 'unread' ? 'Aucun message non lu' : filter === 'read' ? 'Aucun message lu' : 'Les messages apparaitront ici'}
          </p>
        </Card>
      ) : (
        <div className="space-y-2">
          {messages?.map((message) => (
            <Card
              key={message.id}
              padding="sm"
              hover
              onClick={() => openMessage(message)}
              className={`cursor-pointer ${!message.read ? 'ring-1 ring-gold-200 bg-gold-50/30' : ''}`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg shrink-0 ${!message.read ? 'bg-gold-100 text-gold-600' : 'bg-gray-100 text-gray-400'}`}>
                  {message.read ? <MailOpen className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className={`text-sm font-medium truncate ${!message.read ? 'text-gray-900' : 'text-gray-600'}`}>
                      {message.name}
                    </h3>
                    <span className="text-xs text-gray-400 whitespace-nowrap">{formatDate(message.created_at)}</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{message.email}</p>
                  <p className={`text-sm mt-1 line-clamp-1 ${!message.read ? 'text-gray-700' : 'text-gray-500'}`}>
                    {message.message}
                  </p>
                </div>

                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={(e) => toggleRead(message, e)}
                    className="p-1.5 text-gray-400 hover:text-gold-600 hover:bg-gold-50 rounded-lg transition-colors"
                    title={message.read ? 'Marquer comme non lu' : 'Marquer comme lu'}
                  >
                    {message.read ? <Mail className="w-4 h-4" /> : <MailOpen className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteId(message.id);
                    }}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Message Detail Modal */}
      <Modal
        open={!!selectedMessage}
        onClose={() => setSelectedMessage(null)}
        title="Detail du message"
      >
        {selectedMessage && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-full bg-gold-100 flex items-center justify-center">
                <User className="w-5 h-5 text-gold-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{selectedMessage.name}</h3>
                <p className="text-sm text-gray-500">{selectedMessage.email}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-sm">
              {selectedMessage.phone && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-4 h-4" />
                  <a href={`tel:${selectedMessage.phone}`} className="hover:text-gold-600">
                    {selectedMessage.phone}
                  </a>
                </div>
              )}
              <div className="flex items-center gap-2 text-gray-500">
                <Calendar className="w-4 h-4" />
                {new Date(selectedMessage.created_at).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedMessage.message}</p>
            </div>

            <div className="flex justify-between pt-4 border-t border-gray-100">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  markAsReadMutation.mutate({
                    id: selectedMessage.id,
                    read: !selectedMessage.read,
                  });
                  setSelectedMessage({ ...selectedMessage, read: !selectedMessage.read });
                }}
              >
                {selectedMessage.read ? <Mail className="w-4 h-4" /> : <MailOpen className="w-4 h-4" />}
                {selectedMessage.read ? 'Marquer non lu' : 'Marquer lu'}
              </Button>

              <Button
                variant="danger"
                size="sm"
                onClick={() => setDeleteId(selectedMessage.id)}
              >
                <Trash2 className="w-4 h-4" />
                Supprimer
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Supprimer le message"
        message="Etes-vous sur de vouloir supprimer ce message ? Cette action est irreversible."
        confirmText="Supprimer"
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
