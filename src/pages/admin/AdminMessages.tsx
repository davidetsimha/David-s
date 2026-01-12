import { useState } from 'react';
import { Mail, MailOpen, Trash2, Loader2, Phone, Calendar, User } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl text-gray-900">Messages</h1>
          <p className="text-gray-500 mt-1">
            {unreadCount > 0 ? `${unreadCount} message${unreadCount > 1 ? 's' : ''} non lu${unreadCount > 1 ? 's' : ''}` : 'Tous les messages sont lus'}
          </p>
        </div>

        <div className="flex gap-2">
          {filters.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === key
                  ? 'bg-gold-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gold-500" />
        </div>
      ) : messages?.length === 0 ? (
        <Card className="text-center py-12">
          <Mail className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">
            {filter === 'unread' ? 'Aucun message non lu' : filter === 'read' ? 'Aucun message lu' : 'Aucun message'}
          </p>
        </Card>
      ) : (
        <div className="space-y-2">
          {messages?.map((message) => (
            <Card
              key={message.id}
              onClick={() => openMessage(message)}
              className={`cursor-pointer hover:shadow-md transition-all ${
                !message.read ? 'border-l-4 border-l-gold-500 bg-gold-50/30' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-full ${!message.read ? 'bg-gold-100 text-gold-600' : 'bg-gray-100 text-gray-400'}`}>
                  {message.read ? <MailOpen className="w-5 h-5" /> : <Mail className="w-5 h-5" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className={`font-medium truncate ${!message.read ? 'text-gray-900' : 'text-gray-600'}`}>
                      {message.name}
                    </h3>
                    <span className="text-xs text-gray-400 whitespace-nowrap">{formatDate(message.created_at)}</span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{message.email}</p>
                  <p className={`text-sm mt-1 line-clamp-2 ${!message.read ? 'text-gray-700' : 'text-gray-500'}`}>
                    {message.message}
                  </p>
                </div>

                <div className="flex gap-1 flex-shrink-0">
                  <button
                    onClick={(e) => toggleRead(message, e)}
                    className="p-2 text-gray-400 hover:text-gold-600 hover:bg-gold-50 rounded-lg"
                    title={message.read ? 'Marquer comme non lu' : 'Marquer comme lu'}
                  >
                    {message.read ? <Mail className="w-4 h-4" /> : <MailOpen className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteId(message.id);
                    }}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
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
            <div className="flex items-center gap-3 pb-4 border-b">
              <div className="w-12 h-12 rounded-full bg-gold-100 flex items-center justify-center">
                <User className="w-6 h-6 text-gold-600" />
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
              <div className="flex items-center gap-2 text-gray-600">
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
              <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.message}</p>
            </div>

            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
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

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => window.location.href = `mailto:${selectedMessage.email}`}
                >
                  Repondre
                </Button>
                <Button
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => {
                    setDeleteId(selectedMessage.id);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                  Supprimer
                </Button>
              </div>
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
