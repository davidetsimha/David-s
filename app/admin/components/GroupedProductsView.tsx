'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, Package } from 'lucide-react'
import { Checkbox } from '@/components/ui/Checkbox'
import { ProductCard } from './ProductCard'
import { computeSelectionState } from '@/hooks/useSelection'
import type { Product } from '@/types'

export type GroupByOption = 'category' | 'product_type'

interface ProductGroup {
  key: string
  label: string
  labelHe?: string
  products: Product[]
}

interface GroupedProductsViewProps {
  products: Product[]
  groupBy: GroupByOption
  selectedIds: Set<string>
  onToggleSelect: (id: string) => void
  onToggleGroupSelect: (ids: string[]) => void
  onEdit: (product: Product) => void
  onDelete: (id: string) => void
  onToggleAvailability: (id: string, available: boolean) => void
  selectable?: boolean
}

export function GroupedProductsView({
  products,
  groupBy,
  selectedIds,
  onToggleSelect,
  onToggleGroupSelect,
  onEdit,
  onDelete,
  onToggleAvailability,
  selectable = true,
}: GroupedProductsViewProps) {
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set())

  const toggleCollapse = (groupKey: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev)
      if (next.has(groupKey)) {
        next.delete(groupKey)
      } else {
        next.add(groupKey)
      }
      return next
    })
  }

  // Group products
  const groups: ProductGroup[] = (() => {
    const groupMap = new Map<string, ProductGroup>()

    if (groupBy === 'category') {
      products.forEach((product) => {
        const key = product.category_id || 'uncategorized'
        const label = product.category?.name_fr || 'Sans categorie'
        const labelHe = product.category?.name_he

        if (!groupMap.has(key)) {
          groupMap.set(key, { key, label, labelHe, products: [] })
        }
        groupMap.get(key)!.products.push(product)
      })
    } else if (groupBy === 'product_type') {
      products.forEach((product) => {
        const key = product.product_type || 'individual'
        const label = key === 'plateau' ? 'Plateaux' : 'Produits individuels'
        const labelHe = key === 'plateau' ? 'מגשים' : 'מוצרים בודדים'

        if (!groupMap.has(key)) {
          groupMap.set(key, { key, label, labelHe, products: [] })
        }
        groupMap.get(key)!.products.push(product)
      })
    }

    return Array.from(groupMap.values()).sort((a, b) => a.label.localeCompare(b.label))
  })()

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

  return (
    <div className="space-y-4">
      {groups.map((group) => {
        const groupProductIds = group.products.map((p) => p.id)
        const { isAllSelected, isIndeterminate } = computeSelectionState(
          selectedIds,
          groupProductIds
        )
        const isCollapsed = collapsedGroups.has(group.key)

        return (
          <div
            key={group.key}
            className="bg-white rounded-xl border border-gray-100 shadow-card overflow-hidden"
          >
            {/* Group Header */}
            <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border-b border-gray-100">
              {selectable && (
                <Checkbox
                  checked={isAllSelected}
                  indeterminate={isIndeterminate}
                  onChange={() => onToggleGroupSelect(groupProductIds)}
                  size="sm"
                />
              )}

              <button
                onClick={() => toggleCollapse(group.key)}
                className="flex items-center gap-2 flex-1 text-start"
              >
                {isCollapsed ? (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
                <span className="font-medium text-gray-900">{group.label}</span>
                {group.labelHe && (
                  <span className="text-sm text-gray-500" dir="rtl">
                    ({group.labelHe})
                  </span>
                )}
              </button>

              <span className="text-sm text-gray-500">
                {group.products.length} produit{group.products.length > 1 ? 's' : ''}
              </span>
            </div>

            {/* Group Content */}
            {!isCollapsed && (
              <div className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {group.products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onToggleAvailability={onToggleAvailability}
                      selectable={selectable}
                      selected={selectedIds.has(product.id)}
                      onToggleSelect={() => onToggleSelect(product.id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
