import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { ConfirmModal } from '../../components/admin/ConfirmModal';
import { CategoriesTable } from '../../components/admin/CategoriesTable';
import { CategoryForm } from '../../components/admin/CategoryForm';
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '../../hooks/useCategories';
import type { Category, CreateCategoryDTO } from '../../types';

export function AdminCategories() {
  const { data: categories, isLoading } = useCategories();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const [modalOpen, setModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | undefined>();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const openCreate = () => { setEditCategory(undefined); setModalOpen(true); };
  const openEdit = (c: Category) => { setEditCategory(c); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditCategory(undefined); };

  const handleSubmit = (data: CreateCategoryDTO) => {
    if (editCategory) {
      updateMutation.mutate({ id: editCategory.id, data }, { onSuccess: closeModal });
    } else {
      createMutation.mutate(data, { onSuccess: closeModal });
    }
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId, {
        onSuccess: () => {
          setDeleteId(null);
          setDeleteError(null);
        },
        onError: (error) => {
          setDeleteError(error instanceof Error ? error.message : 'Erreur lors de la suppression');
        },
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl text-gray-900">Categories</h1>
          <p className="text-gray-500 mt-1">Gerez les categories de produits</p>
        </div>
        <Button onClick={openCreate}><Plus className="w-5 h-5" /> Ajouter une categorie</Button>
      </div>

      <Card padding="none" hover={false}>
        <CategoriesTable
          categories={categories ?? []}
          loading={isLoading}
          onEdit={openEdit}
          onDelete={(id) => { setDeleteId(id); setDeleteError(null); }}
        />
      </Card>

      <Modal open={modalOpen} onClose={closeModal} title={editCategory ? 'Modifier la categorie' : 'Nouvelle categorie'}>
        <CategoryForm category={editCategory} onSubmit={handleSubmit} loading={createMutation.isPending || updateMutation.isPending} />
      </Modal>

      <ConfirmModal
        open={!!deleteId}
        onClose={() => { setDeleteId(null); setDeleteError(null); }}
        onConfirm={handleDelete}
        title="Supprimer la categorie"
        message={deleteError || "Etes-vous sur de vouloir supprimer cette categorie ? Cette action est irreversible."}
        confirmText="Supprimer"
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
