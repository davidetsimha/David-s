import { useState } from 'react';
import { Plus, Trash2, Edit2, Save, X, Loader2 } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { ConfirmModal } from '../../components/admin/ConfirmModal';
import { ImageUpload } from '../../components/admin/ImageUpload';
import { useGallery, useCreateGalleryImage, useDeleteGalleryImage } from '../../hooks/useGallery';
import { useCreations, useCreateCreation, useUpdateCreation, useDeleteCreation } from '../../hooks/useCreations';
import { useEventTypes, useUpdateEventType } from '../../hooks/useEventTypes';
import type { Creation } from '../../services/creations.service';
import type { EventType } from '../../services/eventTypes.service';
import type { GalleryCategory } from '../../types';

type Tab = 'gallery' | 'events' | 'creations';

export function AdminMedia() {
  const [activeTab, setActiveTab] = useState<Tab>('gallery');

  const tabs: { key: Tab; label: string }[] = [
    { key: 'gallery', label: 'Galerie' },
    { key: 'events', label: 'Evenements' },
    { key: 'creations', label: 'Nos Creations' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl lg:text-3xl text-gray-900">Medias</h1>
        <p className="text-gray-500 mt-1">Gerez les images et contenus visuels</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex gap-6">
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors
                ${activeTab === key
                  ? 'border-gold-500 text-gold-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'gallery' && <GalleryTab />}
      {activeTab === 'events' && <EventsTab />}
      {activeTab === 'creations' && <CreationsTab />}
    </div>
  );
}

// ==================== GALLERY TAB ====================
function GalleryTab() {
  const { data: images, isLoading } = useGallery();
  const createMutation = useCreateGalleryImage();
  const deleteMutation = useDeleteGalleryImage();

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [newImage, setNewImage] = useState<{ image_url: string; alt_fr: string; alt_he: string; category: GalleryCategory }>({
    image_url: '',
    alt_fr: '',
    alt_he: '',
    category: 'products',
  });

  const handleCreate = () => {
    if (!newImage.image_url) return;
    createMutation.mutate(newImage, {
      onSuccess: () => {
        setModalOpen(false);
        setNewImage({ image_url: '', alt_fr: '', alt_he: '', category: 'products' });
      },
    });
  };

  return (
    <>
      <div className="flex justify-end">
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="w-5 h-5" /> Ajouter une image
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gold-500" />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images?.map((img) => (
            <Card key={img.id} padding="none" className="overflow-hidden group">
              <div className="aspect-square relative">
                <img src={img.image_url} alt={img.alt_fr || ''} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => setDeleteId(img.id)}
                    className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-3">
                <p className="text-sm text-gray-600 truncate">{img.alt_fr || 'Sans description'}</p>
                <p className="text-xs text-gray-400">{img.category}</p>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Ajouter une image">
        <div className="space-y-4">
          <ImageUpload
            value={newImage.image_url}
            onUpload={(url) => setNewImage(prev => ({ ...prev, image_url: url }))}
            onRemove={() => setNewImage(prev => ({ ...prev, image_url: '' }))}
            folder="gallery"
            label="Image"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (FR)</label>
            <input
              type="text"
              value={newImage.alt_fr}
              onChange={(e) => setNewImage(prev => ({ ...prev, alt_fr: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (HE)</label>
            <input
              type="text"
              value={newImage.alt_he}
              onChange={(e) => setNewImage(prev => ({ ...prev, alt_he: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500"
              dir="rtl"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categorie</label>
            <select
              value={newImage.category}
              onChange={(e) => setNewImage(prev => ({ ...prev, category: e.target.value as GalleryCategory }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500"
            >
              <option value="products">Produits</option>
              <option value="receptions">Receptions</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setModalOpen(false)}>Annuler</Button>
            <Button onClick={handleCreate} disabled={!newImage.image_url || createMutation.isPending}>
              {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Ajouter'}
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        title="Supprimer l'image"
        message="Etes-vous sur de vouloir supprimer cette image ?"
        confirmText="Supprimer"
        loading={deleteMutation.isPending}
      />
    </>
  );
}

// ==================== EVENTS TAB ====================
function EventsTab() {
  const { data: eventTypes, isLoading } = useEventTypes();
  const updateMutation = useUpdateEventType();

  const [editId, setEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<EventType>>({});

  const startEdit = (event: EventType) => {
    setEditId(event.id);
    setEditData({
      title_fr: event.title_fr,
      title_he: event.title_he,
      description_fr: event.description_fr,
      description_he: event.description_he,
      image_url: event.image_url,
    });
  };

  const saveEdit = () => {
    if (!editId) return;
    updateMutation.mutate({ id: editId, data: editData }, {
      onSuccess: () => setEditId(null),
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-gold-500" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {eventTypes?.map((event) => (
        <Card key={event.id} className={editId === event.id ? 'ring-2 ring-gold-500' : ''}>
          {editId === event.id ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ImageUpload
                  value={editData.image_url || ''}
                  onUpload={(url) => setEditData(prev => ({ ...prev, image_url: url }))}
                  onRemove={() => setEditData(prev => ({ ...prev, image_url: '' }))}
                  folder="events"
                  label="Image"
                />
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Titre (FR)</label>
                    <input
                      type="text"
                      value={editData.title_fr || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, title_fr: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Titre (HE)</label>
                    <input
                      type="text"
                      value={editData.title_he || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, title_he: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500"
                      dir="rtl"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description (FR)</label>
                  <textarea
                    value={editData.description_fr || ''}
                    onChange={(e) => setEditData(prev => ({ ...prev, description_fr: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description (HE)</label>
                  <textarea
                    value={editData.description_he || ''}
                    onChange={(e) => setEditData(prev => ({ ...prev, description_he: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500"
                    dir="rtl"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setEditId(null)}>
                  <X className="w-4 h-4" /> Annuler
                </Button>
                <Button onClick={saveEdit} disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Sauvegarder</>}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex gap-4">
              <div className="w-32 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                {event.image_url ? (
                  <img src={event.image_url} alt={event.title_fr} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    Pas d'image
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900">{event.title_fr}</h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{event.description_fr}</p>
                <p className="text-xs text-gray-400 mt-1">Slug: {event.slug}</p>
              </div>
              <button
                onClick={() => startEdit(event)}
                className="p-2 text-gray-400 hover:text-gold-600 hover:bg-gold-50 rounded-lg self-start"
              >
                <Edit2 className="w-5 h-5" />
              </button>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}

// ==================== CREATIONS TAB ====================
function CreationsTab() {
  const { data: creations, isLoading } = useCreations();
  const createMutation = useCreateCreation();
  const updateMutation = useUpdateCreation();
  const deleteMutation = useDeleteCreation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editCreation, setEditCreation] = useState<Creation | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title_fr: '',
    title_he: '',
    description_fr: '',
    description_he: '',
    image_url: '',
    sort_order: 0,
  });

  const openCreate = () => {
    setEditCreation(null);
    setFormData({ title_fr: '', title_he: '', description_fr: '', description_he: '', image_url: '', sort_order: 0 });
    setModalOpen(true);
  };

  const openEdit = (creation: Creation) => {
    setEditCreation(creation);
    setFormData({
      title_fr: creation.title_fr,
      title_he: creation.title_he,
      description_fr: creation.description_fr || '',
      description_he: creation.description_he || '',
      image_url: creation.image_url,
      sort_order: creation.sort_order,
    });
    setModalOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.image_url || !formData.title_fr || !formData.title_he) return;

    if (editCreation) {
      updateMutation.mutate({ id: editCreation.id, data: formData }, {
        onSuccess: () => setModalOpen(false),
      });
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => setModalOpen(false),
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-gold-500" />
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-end">
        <Button onClick={openCreate}>
          <Plus className="w-5 h-5" /> Ajouter une creation
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {creations?.map((creation) => (
          <Card key={creation.id} padding="none" className="overflow-hidden group">
            <div className="aspect-square relative">
              <img src={creation.image_url} alt={creation.title_fr} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => openEdit(creation)}
                  className="p-2 bg-white text-gray-800 rounded-lg hover:bg-gray-100"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setDeleteId(creation.id)}
                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-3">
              <p className="font-medium text-gray-900 truncate">{creation.title_fr}</p>
              <p className="text-sm text-gray-500 truncate">{creation.description_fr}</p>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editCreation ? 'Modifier la creation' : 'Nouvelle creation'}
      >
        <div className="space-y-4">
          <ImageUpload
            value={formData.image_url}
            onUpload={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
            onRemove={() => setFormData(prev => ({ ...prev, image_url: '' }))}
            folder="creations"
            label="Image"
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Titre (FR) *</label>
              <input
                type="text"
                value={formData.title_fr}
                onChange={(e) => setFormData(prev => ({ ...prev, title_fr: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Titre (HE) *</label>
              <input
                type="text"
                value={formData.title_he}
                onChange={(e) => setFormData(prev => ({ ...prev, title_he: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500"
                dir="rtl"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (FR)</label>
              <textarea
                value={formData.description_fr}
                onChange={(e) => setFormData(prev => ({ ...prev, description_fr: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (HE)</label>
              <textarea
                value={formData.description_he}
                onChange={(e) => setFormData(prev => ({ ...prev, description_he: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500"
                dir="rtl"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setModalOpen(false)}>Annuler</Button>
            <Button
              onClick={handleSubmit}
              disabled={!formData.image_url || !formData.title_fr || !formData.title_he || createMutation.isPending || updateMutation.isPending}
            >
              {(createMutation.isPending || updateMutation.isPending) ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : editCreation ? 'Modifier' : 'Ajouter'}
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        title="Supprimer la creation"
        message="Etes-vous sur de vouloir supprimer cette creation ?"
        confirmText="Supprimer"
        loading={deleteMutation.isPending}
      />
    </>
  );
}
