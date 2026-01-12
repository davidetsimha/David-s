import { useState } from 'react';
import { Plus, Edit2, Trash2, GripVertical, Loader2 } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { ConfirmModal } from '../../components/admin/ConfirmModal';
import { useFAQs, useCreateFAQ, useUpdateFAQ, useDeleteFAQ } from '../../hooks/useFAQs';
import type { FAQ } from '../../services/faq.service';

export function AdminFAQ() {
  const { data: faqs, isLoading } = useFAQs();
  const createMutation = useCreateFAQ();
  const updateMutation = useUpdateFAQ();
  const deleteMutation = useDeleteFAQ();

  const [modalOpen, setModalOpen] = useState(false);
  const [editFAQ, setEditFAQ] = useState<FAQ | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    question_fr: '',
    question_he: '',
    answer_fr: '',
    answer_he: '',
    sort_order: 0,
  });

  const openCreate = () => {
    setEditFAQ(null);
    setFormData({
      question_fr: '',
      question_he: '',
      answer_fr: '',
      answer_he: '',
      sort_order: (faqs?.length ?? 0) + 1,
    });
    setModalOpen(true);
  };

  const openEdit = (faq: FAQ) => {
    setEditFAQ(faq);
    setFormData({
      question_fr: faq.question_fr,
      question_he: faq.question_he,
      answer_fr: faq.answer_fr,
      answer_he: faq.answer_he,
      sort_order: faq.sort_order,
    });
    setModalOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.question_fr || !formData.question_he || !formData.answer_fr || !formData.answer_he) return;

    if (editFAQ) {
      updateMutation.mutate({ id: editFAQ.id, data: formData }, {
        onSuccess: () => setModalOpen(false),
      });
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => setModalOpen(false),
      });
    }
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId, {
        onSuccess: () => setDeleteId(null),
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl text-gray-900">FAQ</h1>
          <p className="text-gray-500 mt-1">Gerez les questions frequemment posees</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="w-5 h-5" /> Ajouter une question
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gold-500" />
        </div>
      ) : faqs?.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-gray-500">Aucune question pour le moment.</p>
          <Button onClick={openCreate} variant="outline" className="mt-4">
            <Plus className="w-5 h-5" /> Ajouter la premiere question
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {faqs?.map((faq) => (
            <Card key={faq.id} className="flex items-start gap-4">
              <div className="text-gray-300 cursor-grab">
                <GripVertical className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{faq.question_fr}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{faq.answer_fr}</p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEdit(faq)}
                      className="p-2 text-gray-400 hover:text-gold-600 hover:bg-gold-50 rounded-lg"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteId(faq.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-sm text-gray-400 mb-1">Hebreu:</p>
                  <p className="text-sm text-gray-600" dir="rtl">{faq.question_he}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editFAQ ? 'Modifier la question' : 'Nouvelle question'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Question (FR) *</label>
            <input
              type="text"
              value={formData.question_fr}
              onChange={(e) => setFormData(prev => ({ ...prev, question_fr: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500"
              placeholder="Quelle est votre question ?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Question (HE) *</label>
            <input
              type="text"
              value={formData.question_he}
              onChange={(e) => setFormData(prev => ({ ...prev, question_he: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500"
              dir="rtl"
              placeholder="מה השאלה שלך?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reponse (FR) *</label>
            <textarea
              value={formData.answer_fr}
              onChange={(e) => setFormData(prev => ({ ...prev, answer_fr: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500"
              placeholder="Votre reponse..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reponse (HE) *</label>
            <textarea
              value={formData.answer_he}
              onChange={(e) => setFormData(prev => ({ ...prev, answer_he: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500"
              dir="rtl"
              placeholder="התשובה שלך..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ordre d'affichage</label>
            <input
              type="number"
              value={formData.sort_order}
              onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
              className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500"
              min={0}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setModalOpen(false)}>Annuler</Button>
            <Button
              onClick={handleSubmit}
              disabled={
                !formData.question_fr ||
                !formData.question_he ||
                !formData.answer_fr ||
                !formData.answer_he ||
                createMutation.isPending ||
                updateMutation.isPending
              }
            >
              {(createMutation.isPending || updateMutation.isPending) ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : editFAQ ? 'Modifier' : 'Ajouter'}
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Supprimer la question"
        message="Etes-vous sur de vouloir supprimer cette question ? Cette action est irreversible."
        confirmText="Supprimer"
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
