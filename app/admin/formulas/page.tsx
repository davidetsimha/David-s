'use client'

import { useState } from 'react'
import { Pencil, UtensilsCrossed, Plus, X, Loader2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useEventFormulas, useUpdateEventFormula } from '@/hooks/useFormulas'
import type { EventFormula } from '@/types'

const schema = z.object({
  name_fr: z.string().min(1, 'Le nom en francais est requis'),
  name_he: z.string().min(1, 'Le nom en hebreu est requis'),
  tagline_fr: z.string().min(1, 'Le slogan en francais est requis'),
  tagline_he: z.string().min(1, 'Le slogan en hebreu est requis'),
  price: z.coerce.number().min(0, 'Le prix doit etre positif'),
  min_guests: z.coerce.number().min(1, 'Le minimum d\'invites est requis'),
  image_url: z.string().nullable(),
  includes_fr: z.array(z.object({ value: z.string() })),
  includes_he: z.array(z.object({ value: z.string() })),
})

type FormData = z.infer<typeof schema>

export default function AdminFormulasPage() {
  const { data: formulas, isLoading } = useEventFormulas()
  const updateMutation = useUpdateEventFormula()

  const [modalOpen, setModalOpen] = useState(false)
  const [editFormula, setEditFormula] = useState<EventFormula | undefined>()

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema) as never,
  })

  const {
    fields: includesFrFields,
    append: appendIncludeFr,
    remove: removeIncludeFr,
  } = useFieldArray({ control, name: 'includes_fr' })

  const {
    fields: includesHeFields,
    append: appendIncludeHe,
    remove: removeIncludeHe,
  } = useFieldArray({ control, name: 'includes_he' })

  const openEdit = (formula: EventFormula) => {
    setEditFormula(formula)
    reset({
      name_fr: formula.name_fr,
      name_he: formula.name_he,
      tagline_fr: formula.tagline_fr,
      tagline_he: formula.tagline_he,
      price: formula.price,
      min_guests: formula.min_guests,
      image_url: formula.image_url,
      includes_fr: formula.includes_fr.map((item) => ({ value: item })),
      includes_he: formula.includes_he.map((item) => ({ value: item })),
    })
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditFormula(undefined)
  }

  const onSubmit = (data: FormData) => {
    if (editFormula) {
      updateMutation.mutate(
        {
          id: editFormula.id,
          data: {
            name_fr: data.name_fr,
            name_he: data.name_he,
            tagline_fr: data.tagline_fr,
            tagline_he: data.tagline_he,
            price: data.price,
            min_guests: data.min_guests,
            image_url: data.image_url || null,
            includes_fr: data.includes_fr.map((item) => item.value).filter(Boolean),
            includes_he: data.includes_he.map((item) => item.value).filter(Boolean),
          },
        },
        { onSuccess: closeModal }
      )
    }
  }

  const morningFormulas = formulas?.filter((f) => f.time_slot === 'morning') || []
  const afternoonFormulas = formulas?.filter((f) => f.time_slot === 'afternoon') || []

  const FormulaCard = ({ formula }: { formula: EventFormula }) => (
    <Card className="relative overflow-hidden">
      {formula.image_url && (
        <div className="absolute inset-0 opacity-10">
          <img
            src={formula.image_url}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 bg-gold-100 text-gold-700 text-xs font-medium rounded">
                {formula.time_slot === 'morning' ? 'Matin' : 'Apres-midi'}
              </span>
            </div>
            <h3 className="font-display text-lg text-gray-900">{formula.name_fr}</h3>
            <p className="text-sm text-gray-500" dir="rtl">{formula.name_he}</p>
            <p className="text-sm text-gray-600 mt-2">{formula.tagline_fr}</p>
          </div>
          <div className="text-right">
            <p className="font-display text-2xl text-gold-600">{formula.price} ₪</p>
            <p className="text-xs text-gray-500">min. {formula.min_guests} invites</p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Inclus</p>
          <div className="flex flex-wrap gap-1">
            {formula.includes_fr.slice(0, 5).map((item, i) => (
              <span
                key={i}
                className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
              >
                {item}
              </span>
            ))}
            {formula.includes_fr.length > 5 && (
              <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded">
                +{formula.includes_fr.length - 5} autres
              </span>
            )}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
          <Button variant="secondary" size="sm" onClick={() => openEdit(formula)}>
            <Pencil className="w-4 h-4" /> Modifier
          </Button>
        </div>
      </div>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl lg:text-3xl text-gray-900">Formules Evenements</h1>
        <p className="text-gray-500 mt-1">Modifiez les 6 formules proposees pour les evenements</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gold-500" />
        </div>
      ) : formulas?.length === 0 ? (
        <Card className="text-center py-12">
          <UtensilsCrossed className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">Aucune formule trouvee.</p>
          <p className="text-sm text-gray-400 mt-2">
            Executez la migration pour ajouter les formules.
          </p>
        </Card>
      ) : (
        <>
          {/* Morning Formulas */}
          <div>
            <h2 className="font-display text-lg text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                <span className="text-amber-600">☀</span>
              </span>
              Formules Matin
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              {morningFormulas.map((formula) => (
                <FormulaCard key={formula.id} formula={formula} />
              ))}
            </div>
          </div>

          {/* Afternoon Formulas */}
          <div>
            <h2 className="font-display text-lg text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                <span className="text-orange-600">☼</span>
              </span>
              Formules Apres-midi
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              {afternoonFormulas.map((formula) => (
                <FormulaCard key={formula.id} formula={formula} />
              ))}
            </div>
          </div>
        </>
      )}

      {/* Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={`Modifier ${editFormula?.name_fr || 'la formule'}`}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Nom (FR)"
              {...register('name_fr')}
              error={errors.name_fr?.message}
            />
            <Input
              label="Nom (HE)"
              {...register('name_he')}
              error={errors.name_he?.message}
              dir="rtl"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Slogan (FR)"
              {...register('tagline_fr')}
              error={errors.tagline_fr?.message}
            />
            <Input
              label="Slogan (HE)"
              {...register('tagline_he')}
              error={errors.tagline_he?.message}
              dir="rtl"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Prix (₪)"
              type="number"
              {...register('price')}
              error={errors.price?.message}
            />
            <Input
              label="Min. invites"
              type="number"
              {...register('min_guests')}
              error={errors.min_guests?.message}
            />
          </div>

          {/* Includes FR */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Inclus (FR)</label>
            <div className="space-y-2">
              {includesFrFields.map((field, index) => (
                <div key={field.id} className="flex gap-2">
                  <input
                    {...register(`includes_fr.${index}.value`)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 text-sm"
                    placeholder="Element inclus..."
                  />
                  <button
                    type="button"
                    onClick={() => removeIncludeFr(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => appendIncludeFr({ value: '' })}
                className="text-sm text-gold-600 hover:text-gold-700 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Ajouter un element
              </button>
            </div>
          </div>

          {/* Includes HE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Inclus (HE)</label>
            <div className="space-y-2">
              {includesHeFields.map((field, index) => (
                <div key={field.id} className="flex gap-2">
                  <input
                    {...register(`includes_he.${index}.value`)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 text-sm"
                    placeholder="פריט כלול..."
                    dir="rtl"
                  />
                  <button
                    type="button"
                    onClick={() => removeIncludeHe(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => appendIncludeHe({ value: '' })}
                className="text-sm text-gold-600 hover:text-gold-700 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Ajouter un element
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button type="button" variant="secondary" onClick={closeModal} className="flex-1">
              Annuler
            </Button>
            <Button type="submit" loading={updateMutation.isPending} className="flex-1">
              Enregistrer
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
