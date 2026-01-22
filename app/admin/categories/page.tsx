'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '@/hooks/useCategories'
import type { Category, CreateCategoryDTO } from '@/types'

export default function AdminCategoriesPage() {
  const [formOpen, setFormOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | undefined>(undefined)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name_fr: '', name_he: '', slug: '' })

  const { data: categories = [], isLoading } = useCategories()
  const createCategory = useCreateCategory()
  const updateCategory = useUpdateCategory()
  const deleteCategory = useDeleteCategory()

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData({ name_fr: category.name_fr, name_he: category.name_he, slug: category.slug })
    setFormOpen(true)
  }

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleDelete = async () => {
    if (deleteConfirm) {
      await deleteCategory.mutateAsync(deleteConfirm)
      setDeleteConfirm(null)
    }
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const data: CreateCategoryDTO = formData
    if (editingCategory) {
      await updateCategory.mutateAsync({ id: editingCategory.id, data })
    } else {
      await createCategory.mutateAsync(data)
    }
    setFormOpen(false)
    setEditingCategory(undefined)
    setFormData({ name_fr: '', name_he: '', slug: '' })
  }

  const openNewForm = () => {
    setEditingCategory(undefined)
    setFormData({ name_fr: '', name_he: '', slug: '' })
    setFormOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Categories</h1>
          <p className="text-gray-500 mt-1">{categories.length} categories au total</p>
        </div>
        <button
          onClick={openNewForm}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Ajouter
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12 text-gray-500">Aucune categorie</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-start px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Nom (FR)</th>
                <th className="text-start px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Nom (HE)</th>
                <th className="text-start px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {categories.map(category => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{category.name_fr}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{category.name_he}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(category.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Category form modal */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {editingCategory ? 'Modifier la categorie' : 'Nouvelle categorie'}
            </h2>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom (Francais)</label>
                <input
                  type="text"
                  value={formData.name_fr}
                  onChange={(e) => {
                    const newName = e.target.value
                    setFormData(prev => ({
                      ...prev,
                      name_fr: newName,
                      slug: !editingCategory ? generateSlug(newName) : prev.slug
                    }))
                  }}
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
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setFormOpen(false); setEditingCategory(undefined) }}
                  className="flex-1 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={createCategory.isPending || updateCategory.isPending}
                  className="flex-1 py-2 text-sm text-white bg-amber-500 hover:bg-amber-600 rounded-lg disabled:opacity-50"
                >
                  {createCategory.isPending || updateCategory.isPending ? 'Chargement...' : 'Enregistrer'}
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
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Supprimer la categorie</h2>
            <p className="text-sm text-gray-500 mb-4">
              Etes-vous sur de vouloir supprimer cette categorie ? Les produits associes ne seront pas supprimes.
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
                disabled={deleteCategory.isPending}
                className="flex-1 py-2 text-sm text-white bg-red-500 hover:bg-red-600 rounded-lg disabled:opacity-50"
              >
                {deleteCategory.isPending ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
