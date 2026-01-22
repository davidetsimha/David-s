'use client'

import { Package, Pencil, Trash2, Copy, ArrowUpDown } from 'lucide-react'
import { Switch } from '@/components/ui/Switch'
import { Checkbox } from '@/components/ui/Checkbox'
import { DropdownMenu } from '@/components/ui/DropdownMenu'
import { Spinner } from '@/components/ui/Spinner'
import type { Product } from '@/types'

type SortKey = 'name' | 'price' | 'category'
type SortDirection = 'asc' | 'desc'

interface ProductsTableProps {
  products: Product[]
  loading: boolean
  onEdit: (product: Product) => void
  onDelete: (id: string) => void
  onToggleAvailability: (id: string, available: boolean) => void
  onDuplicate?: (product: Product) => void
  sortKey?: SortKey
  sortDirection?: SortDirection
  onSort?: (key: SortKey) => void
  // Selection props
  selectable?: boolean
  selectedIds?: Set<string>
  onToggleSelect?: (id: string) => void
  onToggleAll?: () => void
  isAllSelected?: boolean
  isIndeterminate?: boolean
}

export function ProductsTable({
  products,
  loading,
  onEdit,
  onDelete,
  onToggleAvailability,
  onDuplicate,
  sortKey,
  sortDirection: _sortDirection,
  onSort,
  selectable = false,
  selectedIds,
  onToggleSelect,
  onToggleAll,
  isAllSelected = false,
  isIndeterminate = false,
}: ProductsTableProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
          <Package className="w-6 h-6 text-gray-400" />
        </div>
        <p className="text-sm font-medium text-gray-900">Aucun produit</p>
        <p className="text-sm text-gray-500 mt-1">Commencez par ajouter un produit</p>
      </div>
    )
  }

  const SortableHeader = ({ label, sortKeyName }: { label: string; sortKeyName: SortKey }) => (
    <button
      onClick={() => onSort?.(sortKeyName)}
      className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors group"
    >
      {label}
      <ArrowUpDown className={`w-3.5 h-3.5 transition-colors ${sortKey === sortKeyName ? 'text-gold-500' : 'text-gray-300 group-hover:text-gray-400'}`} />
    </button>
  )

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100">
            {selectable && (
              <th className="text-start px-4 py-3 w-12">
                <Checkbox
                  checked={isAllSelected}
                  indeterminate={isIndeterminate}
                  onChange={() => onToggleAll?.()}
                  size="sm"
                />
              </th>
            )}
            <th className="text-start px-4 py-3 w-16"></th>
            <th className="text-start px-4 py-3">
              {onSort ? (
                <SortableHeader label="Nom" sortKeyName="name" />
              ) : (
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Nom</span>
              )}
            </th>
            <th className="text-start px-4 py-3">
              {onSort ? (
                <SortableHeader label="Categorie" sortKeyName="category" />
              ) : (
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Categorie</span>
              )}
            </th>
            <th className="text-start px-4 py-3">
              {onSort ? (
                <SortableHeader label="Prix" sortKeyName="price" />
              ) : (
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Prix</span>
              )}
            </th>
            <th className="text-start px-4 py-3">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Disponible</span>
            </th>
            <th className="text-start px-4 py-3 w-12"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {products.map((product) => {
            const isSelected = selectable && selectedIds?.has(product.id)
            return (
              <tr
                key={product.id}
                className={`group transition-colors ${
                  isSelected
                    ? 'bg-gold-50/50 hover:bg-gold-50'
                    : 'hover:bg-gray-50/50'
                }`}
              >
                {/* Checkbox */}
                {selectable && (
                  <td className="px-4 py-3">
                    <Checkbox
                      checked={isSelected ?? false}
                      onChange={() => onToggleSelect?.(product.id)}
                      size="sm"
                    />
                  </td>
                )}
                {/* Image */}
                <td className="px-4 py-3">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt=""
                    className="w-11 h-11 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-lg bg-gray-100 flex items-center justify-center">
                    <Package className="w-5 h-5 text-gray-300" />
                  </div>
                )}
              </td>

              {/* Name */}
              <td className="px-4 py-3">
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 truncate max-w-[200px]">{product.name_fr}</p>
                  <p className="text-sm text-gray-500 truncate max-w-[200px]" dir="rtl">{product.name_he}</p>
                </div>
              </td>

              {/* Category */}
              <td className="px-4 py-3">
                <span className="text-sm text-gray-600">
                  {product.category?.name_fr ?? '-'}
                </span>
              </td>

              {/* Price */}
              <td className="px-4 py-3">
                <span className="text-sm font-medium text-gray-900">
                  {product.price.toFixed(0)} ₪
                </span>
              </td>

              {/* Availability */}
              <td className="px-4 py-3">
                <Switch
                  checked={product.available}
                  onChange={(checked) => onToggleAvailability(product.id, checked)}
                  size="sm"
                />
              </td>

              {/* Actions */}
              <td className="px-4 py-3">
                <DropdownMenu
                  items={[
                    { label: 'Modifier', icon: Pencil, onClick: () => onEdit(product) },
                    ...(onDuplicate ? [{ label: 'Dupliquer', icon: Copy, onClick: () => onDuplicate(product) }] : []),
                    { type: 'separator' as const },
                    { label: 'Supprimer', icon: Trash2, onClick: () => onDelete(product.id), variant: 'danger' as const },
                  ]}
                  align="end"
                />
              </td>
            </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
