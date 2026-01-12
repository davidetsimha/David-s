import { Package, Pencil, Trash2, Copy } from 'lucide-react';
import { Switch } from '../ui/Switch';
import { DropdownMenu } from '../ui/DropdownMenu';
import type { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onToggleAvailability: (id: string, available: boolean) => void;
  onDuplicate?: (product: Product) => void;
}

export function ProductCard({
  product,
  onEdit,
  onDelete,
  onToggleAvailability,
  onDuplicate,
}: ProductCardProps) {
  const menuItems = [
    { label: 'Modifier', icon: Pencil, onClick: () => onEdit(product) },
    ...(onDuplicate ? [{ label: 'Dupliquer', icon: Copy, onClick: () => onDuplicate(product) }] : []),
    { type: 'separator' as const },
    { label: 'Supprimer', icon: Trash2, onClick: () => onDelete(product.id), variant: 'danger' as const },
  ];

  return (
    <div className="group bg-white rounded-xl border border-gray-100 shadow-card overflow-hidden transition-all duration-150 hover:shadow-elevated hover:border-gray-200">
      {/* Image */}
      <div className="relative aspect-[4/3] bg-gray-50">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name_fr}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-12 h-12 text-gray-200" />
          </div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Action button */}
        <div className="absolute top-2 end-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-white rounded-lg shadow-card">
            <DropdownMenu items={menuItems} align="end" />
          </div>
        </div>

        {/* Category badge */}
        {product.category && (
          <div className="absolute bottom-2 start-2 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-md text-xs font-medium text-gray-700">
            {product.category.name_fr}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0 flex-1">
            <h3 className="font-medium text-gray-900 truncate">{product.name_fr}</h3>
            <p className="text-sm text-gray-500 truncate" dir="rtl">{product.name_he}</p>
          </div>
          <p className="text-base font-semibold text-gray-900 whitespace-nowrap">
            {product.price.toFixed(0)} <span className="text-sm font-normal text-gray-500">₪</span>
          </p>
        </div>

        {/* Availability toggle */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="text-sm text-gray-500">
            {product.available ? 'Disponible' : 'Masque'}
          </span>
          <Switch
            checked={product.available}
            onChange={(checked) => onToggleAvailability(product.id, checked)}
            size="sm"
          />
        </div>
      </div>
    </div>
  );
}
