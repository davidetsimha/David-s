import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { DataTable } from '../../components/admin/DataTable';
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

  const handleDelete = (id: string) => {
    if (confirm('Delete this product?')) deleteMutation.mutate(id);
  };

  const columns = [
    { key: 'image', header: '', className: 'w-16', render: (p: Product) => (
      p.image_url ? <img src={p.image_url} alt="" className="w-12 h-12 rounded-lg object-cover" /> : <div className="w-12 h-12 rounded-lg bg-gray-100" />
    )},
    { key: 'name', header: 'Name', render: (p: Product) => (
      <div><p className="font-medium text-gray-900">{p.name_fr}</p><p className="text-sm text-gray-500" dir="rtl">{p.name_he}</p></div>
    )},
    { key: 'category', header: 'Category', render: (p: Product) => p.category?.name_fr ?? '-' },
    { key: 'price', header: 'Price', render: (p: Product) => `${p.price.toFixed(2)} ILS` },
    { key: 'status', header: 'Status', render: (p: Product) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.available ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
        {p.available ? 'Available' : 'Hidden'}
      </span>
    )},
    { key: 'actions', header: '', className: 'w-24', render: (p: Product) => (
      <div className="flex gap-1">
        <button onClick={() => openEdit(p)} className="p-2 rounded-lg text-gray-400 hover:text-gold-600 hover:bg-gold-50"><Pencil className="w-4 h-4" /></button>
        <button onClick={() => handleDelete(p.id)} className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-gray-900">Products</h1>
          <p className="text-gray-500 mt-1">Manage your patisserie products</p>
        </div>
        <Button onClick={openCreate}><Plus className="w-5 h-5" /> Add Product</Button>
      </div>

      <Card padding="none" hover={false}>
        <DataTable columns={columns} data={products ?? []} loading={isLoading} keyExtractor={(p) => p.id} emptyMessage="No products yet" />
      </Card>

      <Modal open={modalOpen} onClose={closeModal} title={editProduct ? 'Edit Product' : 'New Product'}>
        <ProductForm product={editProduct} onSubmit={handleSubmit} loading={createMutation.isPending || updateMutation.isPending} />
      </Modal>
    </div>
  );
}
