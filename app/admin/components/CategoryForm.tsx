'use client'

import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import type { Category } from '@/types'

const schema = z.object({
  name_fr: z.string().min(1, 'Le nom en francais est requis'),
  name_he: z.string().min(1, 'Le nom en hebreu est requis'),
  slug: z.string().min(1, 'Le slug est requis').regex(/^[a-z0-9-]+$/, 'Le slug doit contenir uniquement des lettres minuscules, chiffres et tirets'),
  sort_order: z.coerce.number().min(0, "L'ordre doit etre positif"),
})

type FormData = z.infer<typeof schema>

interface CategoryFormProps {
  category?: Category
  onSubmit: (data: FormData) => void
  loading?: boolean
}

export function CategoryForm({ category, onSubmit, loading }: CategoryFormProps) {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormData>({
    resolver: zodResolver(schema) as never,
    defaultValues: {
      name_fr: category?.name_fr ?? '',
      name_he: category?.name_he ?? '',
      slug: category?.slug ?? '',
      sort_order: category?.sort_order ?? 0,
    },
  })

  // Auto-generate slug from French name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (!category) {
      // Only auto-generate for new categories
      const slug = value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
      setValue('slug', slug)
    }
  }

  const handleFormSubmit: SubmitHandler<FormData> = (data) => {
    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Nom (FR)"
          {...register('name_fr')}
          onChange={(e) => {
            register('name_fr').onChange(e)
            handleNameChange(e)
          }}
          error={errors.name_fr?.message}
        />
        <Input label="Nom (HE)" {...register('name_he')} error={errors.name_he?.message} dir="rtl" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input label="Slug (URL)" {...register('slug')} error={errors.slug?.message} placeholder="ex: cakes" />
        <Input label="Ordre d&apos;affichage" type="number" {...register('sort_order')} error={errors.sort_order?.message} />
      </div>

      <div className="pt-4 border-t border-gray-100">
        <Button type="submit" loading={loading} className="w-full">
          {category ? 'Mettre a jour' : 'Creer la categorie'}
        </Button>
      </div>
    </form>
  )
}
