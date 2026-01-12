import { Pencil, Trash2 } from 'lucide-react';
import { DataTable } from './DataTable';
import type { Product } from '../../types';

interface ProductsTableProps {
  products: Product[];
  loading: boolean;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export function ProductsTable({ products, loading, onEdit, onDelete }: ProductsTableProps) {
  const columns = [
    {
      key: 'image',
      header: '',
      className: 'w-16',
      render: (p: Product) =>
        p.image_url ? (
          <img src={p.image_url} alt="" className="w-12 h-12 rounded-lg object-cover" />
        ) : (
          <div className="w-12 h-12 rounded-lg bg-gray-100" />
        ),
    },
    {
      key: 'name',
      header: 'Name',
      render: (p: Product) => (
        <div>
          <p className="font-medium text-gray-900">{p.name_fr}</p>
          <p className="text-sm text-gray-500" dir="rtl">{p.name_he}</p>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      render: (p: Product) => p.category?.name_fr ?? '-',
    },
    {
      key: 'price',
      header: 'Price',
      render: (p: Product) => `${p.price.toFixed(2)} ILS`,
    },
    {
      key: 'status',
      header: 'Status',
      render: (p: Product) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            p.available ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
          }`}
        >
          {p.available ? 'Available' : 'Hidden'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      className: 'w-24',
      render: (p: Product) => (
        <div className="flex gap-1">
          <button
            onClick={() => onEdit(p)}
            className="p-2 rounded-lg text-gray-400 hover:text-gold-600 hover:bg-gold-50 focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 focus-visible:outline-none"
            aria-label={`Edit ${p.name_fr}`}
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(p.id)}
            className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:outline-none"
            aria-label={`Delete ${p.name_fr}`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={products}
      loading={loading}
      keyExtractor={(p) => p.id}
      emptyMessage="No products yet"
    />
  );
}
