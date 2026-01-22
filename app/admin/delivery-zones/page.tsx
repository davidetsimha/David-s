'use client'

import { useState } from 'react'
import { Plus, MapPin, Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Switch } from '@/components/ui/Switch'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  useDeliveryZones,
  useCreateDeliveryZone,
  useUpdateDeliveryZone,
  useDeleteDeliveryZone,
  useToggleDeliveryZoneActive,
} from '@/hooks/useDeliveryZones'
import type { DeliveryZone } from '@/types'

const schema = z.object({
  name_fr: z.string().min(1, 'Le nom en francais est requis'),
  name_he: z.string().min(1, 'Le nom en hebreu est requis'),
  price: z.coerce.number().min(0, 'Le prix doit etre positif'),
  sort_order: z.coerce.number().min(0),
  active: z.boolean(),
})

type FormData = z.infer<typeof schema>

export default function AdminDeliveryZonesPage() {
  const { data: zones, isLoading } = useDeliveryZones(false)
  const createMutation = useCreateDeliveryZone()
  const updateMutation = useUpdateDeliveryZone()
  const deleteMutation = useDeleteDeliveryZone()
  const toggleActiveMutation = useToggleDeliveryZoneActive()

  const [modalOpen, setModalOpen] = useState(false)
  const [editZone, setEditZone] = useState<DeliveryZone | undefined>()
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema) as never,
  })

  const openCreate = () => {
    setEditZone(undefined)
    reset({
      name_fr: '',
      name_he: '',
      price: 0,
      sort_order: (zones?.length ?? 0) + 1,
      active: true,
    })
    setModalOpen(true)
  }

  const openEdit = (zone: DeliveryZone) => {
    setEditZone(zone)
    reset({
      name_fr: zone.name_fr,
      name_he: zone.name_he,
      price: zone.price,
      sort_order: zone.sort_order,
      active: zone.active,
    })
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditZone(undefined)
  }

  const onSubmit = (data: FormData) => {
    if (editZone) {
      updateMutation.mutate({ id: editZone.id, data }, { onSuccess: closeModal })
    } else {
      createMutation.mutate(data, { onSuccess: closeModal })
    }
  }

  const handleDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId, {
        onSuccess: () => setDeleteId(null),
      })
    }
  }

  const handleToggleActive = (zone: DeliveryZone) => {
    toggleActiveMutation.mutate({ id: zone.id, active: !zone.active })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl text-gray-900">Zones de livraison</h1>
          <p className="text-gray-500 mt-1">Gerez les quartiers et les prix de livraison</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="w-5 h-5" /> Ajouter une zone
        </Button>
      </div>

      <Card padding="none" hover={false}>
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Chargement...</div>
        ) : zones?.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Aucune zone de livraison</p>
            <Button onClick={openCreate} variant="secondary" className="mt-4">
              Ajouter une zone
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quartier
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prix
                  </th>
                  <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actif
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {zones?.map((zone) => (
                  <tr key={zone.id} className={!zone.active ? 'bg-gray-50 opacity-60' : ''}>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{zone.name_fr}</p>
                        <p className="text-sm text-gray-500" dir="rtl">
                          {zone.name_he}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gold-600">{zone.price} ₪</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggleActive(zone)}
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                          zone.active
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {zone.active ? (
                          <>
                            <Eye className="w-3 h-3" /> Actif
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" /> Inactif
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEdit(zone)}
                          className="p-2 text-gray-500 hover:text-gold-600 hover:bg-gold-50 rounded-lg transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(zone.id)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editZone ? 'Modifier la zone' : 'Nouvelle zone de livraison'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Nom (FR)"
              {...register('name_fr')}
              error={errors.name_fr?.message}
              placeholder="Centre-ville"
            />
            <Input
              label="Nom (HE)"
              {...register('name_he')}
              error={errors.name_he?.message}
              dir="rtl"
              placeholder="מרכז העיר"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Prix (₪)"
              type="number"
              step="0.01"
              min="0"
              {...register('price')}
              error={errors.price?.message}
              placeholder="40"
            />
            <Input
              label="Ordre d'affichage"
              type="number"
              min="0"
              {...register('sort_order')}
              error={errors.sort_order?.message}
            />
          </div>

          <div className="flex items-center justify-between py-4 px-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Zone active</p>
              <p className="text-sm text-gray-500">La zone sera proposee aux clients</p>
            </div>
            <Controller
              name="active"
              control={control}
              render={({ field }) => <Switch checked={field.value} onChange={field.onChange} />}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={closeModal} className="flex-1">
              Annuler
            </Button>
            <Button
              type="submit"
              loading={createMutation.isPending || updateMutation.isPending}
              className="flex-1"
            >
              {editZone ? 'Mettre a jour' : 'Creer'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <Modal
          open={!!deleteId}
          onClose={() => setDeleteId(null)}
          title="Supprimer la zone"
        >
          <p className="text-gray-600 mb-6">
            Etes-vous sur de vouloir supprimer cette zone de livraison ? Cette action est irreversible.
          </p>
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
        </Modal>
      )}
    </div>
  )
}
