'use client'

import { useState } from 'react'
import { Plus, Trash2, Pencil, Images, Loader2, X } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { ImageUpload } from '@/app/admin/components/ImageUpload'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  useGallery,
  useCreateGalleryImage,
  useUpdateGalleryImage,
  useDeleteGalleryImage,
} from '@/hooks/useGallery'
import type { GalleryImage, GalleryCategory } from '@/types/gallery.types'

const CATEGORIES: { value: GalleryCategory; label: string }[] = [
  { value: 'wedding', label: 'Buffet dessert' },
  { value: 'bar_mitzvah', label: 'Bar Mitzvah' },
  { value: 'bat_mitzvah', label: 'Bat Mitzvah' },
  { value: 'brit', label: 'Brit Mila' },
  { value: 'event', label: 'Événements' },
  { value: 'receptions', label: 'Réceptions' },
  { value: 'products', label: 'Produits' },
]


const schema = z.object({
  alt_fr: z.string().min(1, 'Description FR requise'),
  alt_he: z.string().min(1, 'Description HE requise'),
  category: z.enum(['receptions', 'products']),
  image_url: z.string().min(1, "L'image est requise"),
})

type FormData = z.infer<typeof schema>

export default function AdminGalleryPage() {
  const { data: images, isLoading } = useGallery()
  const createMutation = useCreateGalleryImage()
  const updateMutation = useUpdateGalleryImage()
  const deleteMutation = useDeleteGalleryImage()

  const [modalOpen, setModalOpen] = useState(false)
  const [editImage, setEditImage] = useState<GalleryImage | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { category: 'receptions', image_url: '' },
  })

  const imageUrl = watch('image_url')

  const openAdd = () => {
    setEditImage(null)
    reset({ category: 'receptions', image_url: '', alt_fr: '', alt_he: '' })
    setModalOpen(true)
  }

  const openEdit = (image: GalleryImage) => {
    setEditImage(image)
    reset({
      alt_fr: image.alt_fr,
      alt_he: image.alt_he,
      category: image.category,
      image_url: image.image_url,
    })
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditImage(null)
  }

  const onSubmit = (data: FormData) => {
    if (editImage) {
      updateMutation.mutate(
        { id: editImage.id, data: { alt_fr: data.alt_fr, alt_he: data.alt_he, category: data.category } },
        { onSuccess: closeModal }
      )
    } else {
      createMutation.mutate(
        { image_url: data.image_url, alt_fr: data.alt_fr, alt_he: data.alt_he, category: data.category },
        { onSuccess: closeModal }
      )
    }
  }

  const confirmDelete = (id: string) => setDeleteId(id)

  const handleDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId, { onSuccess: () => setDeleteId(null) })
    }
  }

  const grouped = CATEGORIES.map(c => ({
    ...c,
    items: images?.filter(i => i.category === c.value) ?? [],
  })).filter(g => g.items.length > 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl text-gray-900">Galerie Photos</h1>
          <p className="text-gray-500 mt-1">{images?.length ?? 0} photo{(images?.length ?? 0) > 1 ? 's' : ''}</p>
        </div>
        <Button onClick={openAdd}>
          <Plus className="w-4 h-4" /> Ajouter une photo
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-gold-500" />
        </div>
      ) : images?.length === 0 ? (
        <Card className="text-center py-16">
          <Images className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">Aucune photo dans la galerie.</p>
          <Button className="mt-4" onClick={openAdd}>
            <Plus className="w-4 h-4" /> Ajouter la première photo
          </Button>
        </Card>
      ) : (
        <>
          {grouped.map(({ label, items }) => items.length > 0 && (
            <div key={label}>
              <h2 className="font-display text-lg text-gray-900 mb-4">
                {label}
                <span className="ms-2 text-sm font-normal text-gray-400">({items.length})</span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {items.map(image => (
                  <div key={image.id} className="group relative rounded-xl overflow-hidden border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="aspect-[3/4] overflow-hidden bg-gray-50">
                      <img
                        src={image.image_url}
                        alt={image.alt_fr}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-2">
                      <p className="text-xs text-gray-600 truncate">{image.alt_fr}</p>
                      <p className="text-xs text-gray-400 truncate" dir="rtl">{image.alt_he}</p>
                    </div>
                    <div className="absolute top-2 end-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEdit(image)}
                        className="p-1.5 bg-white rounded-lg shadow text-gray-600 hover:text-gold-600 transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => confirmDelete(image.id)}
                        className="p-1.5 bg-white rounded-lg shadow text-gray-600 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>
      )}

      {/* Add / Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editImage ? 'Modifier la photo' : 'Ajouter une photo'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {!editImage && (
            <ImageUpload
              label="Image"
              folder="gallery"
              value={imageUrl}
              onUpload={(url) => setValue('image_url', url, { shouldValidate: true })}
              onRemove={() => setValue('image_url', '', { shouldValidate: true })}
            />
          )}
          {errors.image_url && (
            <p className="text-sm text-red-500">{errors.image_url.message}</p>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Catégorie</label>
            <select
              {...register('category')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500"
            >
              {CATEGORIES.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          <Input
            label="Description (FR)"
            placeholder="Ex: Buffet de réception élégant"
            {...register('alt_fr')}
            error={errors.alt_fr?.message}
          />
          <Input
            label="Description (HE)"
            placeholder="תיאור בעברית"
            dir="rtl"
            {...register('alt_he')}
            error={errors.alt_he?.message}
          />

          <div className="flex gap-3 pt-2 border-t">
            <Button type="button" variant="secondary" onClick={closeModal} className="flex-1">
              Annuler
            </Button>
            <Button
              type="submit"
              loading={createMutation.isPending || updateMutation.isPending}
              className="flex-1"
            >
              {editImage ? 'Enregistrer' : 'Ajouter'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm mx-4">
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-display text-lg text-gray-900">Supprimer la photo</h3>
              <button onClick={() => setDeleteId(null)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-6">Cette action est irréversible.</p>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setDeleteId(null)} className="flex-1">
                Annuler
              </Button>
              <Button
                variant="danger"
                onClick={handleDelete}
                loading={deleteMutation.isPending}
                className="flex-1"
              >
                Supprimer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
