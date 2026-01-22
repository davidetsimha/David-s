'use client'

import { useState } from 'react'
import { Plus, Search, Pencil, Trash2, Copy, ChevronUp, ChevronDown } from 'lucide-react'
import { useProducts, useDeleteProduct, useToggleProductAvailability, useCreateProduct, useUpdateProduct, useBulkUpdateProductAvailability } from '@/hooks/useProducts'
import { useCategories } from '@/hooks/useCategories'
import { useSelection, computeSelectionState } from '@/hooks/useSelection'
import type { Product, CreateProductDTO } from '@/types'

type SortKey = 'name' | 'price' | 'category'
type SortDirection = 'asc' | 'desc'

export default function AdminProductsPage() {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('')
  const [formOpen, setFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  // Form state
  const [formData, setFormData] = useState<CreateProductDTO>({
    name_fr: '',
    name_he: '',
    description_fr: '',
    description_he: '',
    price: 0,
    category_id: '',
    image_url: '',
    available: true,
  })

  const { data: products = [], isLoading } = useProducts()
  const { data: categories = [] } = useCategories()
  const deleteProduct = useDeleteProduct()
  const toggleAvailability = useToggleProductAvailability()
  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()
  const bulkUpdate = useBulkUpdateProductAvailability()

  const {
    selectedIds,
    toggle,
    toggleAll,
    clearSelection,
  } = useSelection()

  // Filter and sort products
  const filteredProducts = products
    .filter(p => {
      const matchesSearch = search === '' ||
        p.name_fr.toLowerCase().includes(search.toLowerCase()) ||
        p.name_he.includes(search)
      const matchesCategory = categoryFilter === '' || p.category_id === categoryFilter
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      let comparison = 0
      switch (sortKey) {
        case 'name':
          comparison = a.name_fr.localeCompare(b.name_fr)
          break
        case 'price':
          comparison = a.price - b.price
          break
        case 'category':
          comparison = (a.category?.name_fr ?? '').localeCompare(b.category?.name_fr ?? '')
          break
      }
      return sortDirection === 'asc' ? comparison : -comparison
    })

  const filteredIds = filteredProducts.map(p => p.id)
  const { isAllSelected, isIndeterminate } = computeSelectionState(selectedIds, filteredIds)

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDirection('asc')
    }
  }

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) return null
    return sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name_fr: product.name_fr,
      name_he: product.name_he,
      description_fr: product.description_fr || '',
      description_he: product.description_he || '',
      price: product.price,
      category_id: product.category_id,
      image_url: product.image_url || '',
      available: product.available,
    })
    setFormOpen(true)
  }

  const handleDelete = async () => {
    if (deleteConfirm) {
      await deleteProduct.mutateAsync(deleteConfirm)
      setDeleteConfirm(null)
    }
  }

  const handleDuplicate = (product: Product) => {
    setEditingProduct(undefined)
    setFormData({
      name_fr: `${product.name_fr} (copie)`,
      name_he: `${product.name_he} (copie)`,
      description_fr: product.description_fr || '',
      description_he: product.description_he || '',
      price: product.price,
      category_id: product.category_id,
      image_url: product.image_url || '',
      available: product.available,
    })
    setFormOpen(true)
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editingProduct?.id) {
      await updateProduct.mutateAsync({ id: editingProduct.id, data: formData })
    } else {
      await createProduct.mutateAsync(formData)
    }
    setFormOpen(false)
    setEditingProduct(undefined)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name_fr: '',
      name_he: '',
      description_fr: '',
      description_he: '',
      price: 0,
      category_id: '',
      image_url: '',
      available: true,
    })
  }

  const openNewForm = () => {
    setEditingProduct(undefined)
    resetForm()
    setFormOpen(true)
  }

  const handleBulkEnable = async () => {
    await bulkUpdate.mutateAsync({ ids: Array.from(selectedIds), available: true })
    clearSelection()
  }

  const handleBulkDisable = async () => {
    await bulkUpdate.mutateAsync({ ids: Array.from(selectedIds), available: false })
    clearSelection()
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS' }).format(price)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Produits</h1>
          <p className="text-gray-500 mt-1">{products.length} produits au total</p>
        </div>
        <button
          onClick={openNewForm}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Ajouter
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un produit..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
        >
          <option value="">Toutes les categories</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name_fr}</option>
          ))}
        </select>
      </div>

      {/* Bulk actions */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <span className="text-sm font-medium text-amber-700">
            {selectedIds.size} produit(s) selectionne(s)
          </span>
          <div className="flex gap-2 ml-auto">
            <button
              onClick={handleBulkEnable}
              disabled={bulkUpdate.isPending}
              className="px-3 py-1.5 text-sm bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
            >
              Activer
            </button>
            <button
              onClick={handleBulkDisable}
              disabled={bulkUpdate.isPending}
              className="px-3 py-1.5 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
            >
              Desactiver
            </button>
            <button
              onClick={clearSelection}
              className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">Aucun produit</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="w-10 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      ref={(el) => { if (el) el.indeterminate = isIndeterminate }}
                      onChange={() => toggleAll(filteredIds)}
                      className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                    />
                  </th>
                  <th className="text-start px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Image</th>
                  <th
                    className="text-start px-4 py-3 text-xs font-semibold text-gray-500 uppercase cursor-pointer hover:text-gray-700"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-1">
                      Nom <SortIcon column="name" />
                    </div>
                  </th>
                  <th
                    className="text-start px-4 py-3 text-xs font-semibold text-gray-500 uppercase cursor-pointer hover:text-gray-700"
                    onClick={() => handleSort('category')}
                  >
                    <div className="flex items-center gap-1">
                      Categorie <SortIcon column="category" />
                    </div>
                  </th>
                  <th
                    className="text-start px-4 py-3 text-xs font-semibold text-gray-500 uppercase cursor-pointer hover:text-gray-700"
                    onClick={() => handleSort('price')}
                  >
                    <div className="flex items-center gap-1">
                      Prix <SortIcon column="price" />
                    </div>
                  </th>
                  <th className="text-start px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Statut</th>
                  <th className="text-start px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredProducts.map(product => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(product.id)}
                        onChange={() => toggle(product.id)}
                        className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name_fr}
                          className="w-10 h-10 rounded object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded bg-gray-100" />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-900">{product.name_fr}</div>
                      <div className="text-xs text-gray-500">{product.name_he}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {product.category?.name_fr || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleAvailability.mutate({ id: product.id, available: !product.available })}
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          product.available
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {product.available ? 'Disponible' : 'Indisponible'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded"
                          title="Modifier"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDuplicate(product)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                          title="Dupliquer"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(product.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Product form modal */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 my-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {editingProduct?.id ? 'Modifier le produit' : 'Nouveau produit'}
            </h2>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom (Francais)</label>
                  <input
                    type="text"
                    value={formData.name_fr}
                    onChange={(e) => setFormData(prev => ({ ...prev, name_fr: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom (Hebreu)</label>
                  <input
                    type="text"
                    value={formData.name_he}
                    onChange={(e) => setFormData(prev => ({ ...prev, name_he: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                    dir="rtl"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description (Francais)</label>
                  <textarea
                    value={formData.description_fr}
                    onChange={(e) => setFormData(prev => ({ ...prev, description_fr: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description (Hebreu)</label>
                  <textarea
                    value={formData.description_he}
                    onChange={(e) => setFormData(prev => ({ ...prev, description_he: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                    rows={3}
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prix (ILS)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categorie</label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                    required
                  >
                    <option value="">Selectionner...</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name_fr}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL de l'image</label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                  placeholder="https://..."
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="available"
                  checked={formData.available}
                  onChange={(e) => setFormData(prev => ({ ...prev, available: e.target.checked }))}
                  className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                />
                <label htmlFor="available" className="text-sm text-gray-700">Disponible a la vente</label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setFormOpen(false); setEditingProduct(undefined) }}
                  className="flex-1 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={createProduct.isPending || updateProduct.isPending}
                  className="flex-1 py-2 text-sm text-white bg-amber-500 hover:bg-amber-600 rounded-lg disabled:opacity-50"
                >
                  {createProduct.isPending || updateProduct.isPending ? 'Chargement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Supprimer le produit</h2>
            <p className="text-sm text-gray-500 mb-4">
              Etes-vous sur de vouloir supprimer ce produit ? Cette action est irreversible.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteProduct.isPending}
                className="flex-1 py-2 text-sm text-white bg-red-500 hover:bg-red-600 rounded-lg disabled:opacity-50"
              >
                {deleteProduct.isPending ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
