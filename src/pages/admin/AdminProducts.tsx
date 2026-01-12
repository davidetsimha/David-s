import { useState, useMemo } from 'react';
import { Plus, Search } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { ConfirmModal } from '../../components/admin/ConfirmModal';
import { ProductsTable } from '../../components/admin/ProductsTable';
import { ProductForm } from '../../components/admin/ProductForm';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '../../hooks/useProducts';
import type { Product, CreateProductDTO } from '../../types';

export function AdminProducts() {
  const { data: products, isLoading } = useProducts();
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | undefined>();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const filteredProducts = useMemo(() => {
    if (!products || !search.trim()) return products ?? [];
    const q = search.toLowerCase();
    return products.filter(p =>
      p.name_fr.toLowerCase().includes(q) || p.name_he.toLowerCase().includes(q)
    );
  }, [products, search]);

  const openCreate = () => { setEditProduct(undefined); setModalOpen(true); };
  const openEdit = (p: Product) => { setEditProduct(p); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditProduct(undefined); };

  const handleSubmit = (data: CreateProductDTO) => {
    if (editProduct) {
      updateMutation.mutate({ id: editProduct.id, data }, { onSuccess: closeModal });
    } else {
      createMutation.mutate(data, { onSuccess: closeModal });
    }
  };

  const handleDelete = () => {
    if (deleteId) deleteMutation.mutate(deleteId);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl text-gray-900">Products</h1>
          <p className="text-gray-500 mt-1">Manage your patisserie products</p>
        </div>
        <Button onClick={openCreate}><Plus className="w-5 h-5" /> Add Product</Button>
      </div>

      <div className="relative">
        <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full ps-10 pe-4 py-2.5 rounded-lg border border-gray-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none transition-all"
        />
      </div>

      <Card padding="none" hover={false}>
        <ProductsTable
          products={filteredProducts}
          loading={isLoading}
          onEdit={openEdit}
          onDelete={(id) => setDeleteId(id)}
        />
      </Card>

      <Modal open={modalOpen} onClose={closeModal} title={editProduct ? 'Edit Product' : 'New Product'}>
        <ProductForm product={editProduct} onSubmit={handleSubmit} loading={createMutation.isPending || updateMutation.isPending} />
      </Modal>

      <ConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete"
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
