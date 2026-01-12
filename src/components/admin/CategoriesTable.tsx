import { Pencil, Trash2 } from 'lucide-react';
import { DataTable } from './DataTable';
import type { Category } from '../../types';

interface CategoriesTableProps {
  categories: Category[];
  loading: boolean;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}

export function CategoriesTable({ categories, loading, onEdit, onDelete }: CategoriesTableProps) {
  const columns = [
    {
      key: 'name',
      header: 'Nom',
      render: (c: Category) => (
        <div>
          <p className="font-medium text-gray-900">{c.name_fr}</p>
          <p className="text-sm text-gray-500" dir="rtl">{c.name_he}</p>
        </div>
      ),
    },
    {
      key: 'slug',
      header: 'Slug',
      render: (c: Category) => (
        <span className="font-mono text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
          {c.slug}
        </span>
      ),
    },
    {
      key: 'sort_order',
      header: 'Ordre',
      render: (c: Category) => c.sort_order,
    },
    {
      key: 'actions',
      header: '',
      className: 'w-24',
      render: (c: Category) => (
        <div className="flex gap-1">
          <button
            onClick={() => onEdit(c)}
            className="p-2 rounded-lg text-gray-400 hover:text-gold-600 hover:bg-gold-50 focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 focus-visible:outline-none"
            aria-label={`Modifier ${c.name_fr}`}
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(c.id)}
            className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:outline-none"
            aria-label={`Supprimer ${c.name_fr}`}
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
      data={categories}
      loading={loading}
      keyExtractor={(c) => c.id}
      emptyMessage="Aucune categorie"
    />
  );
}
