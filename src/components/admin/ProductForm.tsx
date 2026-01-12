import { useState } from 'react';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Switch } from '../ui/Switch';
import { ImageUpload } from './ImageUpload';
import { useCategories } from '../../hooks/useCategories';
import type { Product } from '../../types';

const schema = z.object({
  name_fr: z.string().min(1, 'Le nom en francais est requis'),
  name_he: z.string().min(1, 'Le nom en hebreu est requis'),
  description_fr: z.string().optional(),
  description_he: z.string().optional(),
  price: z.coerce.number().min(0, 'Le prix doit etre positif'),
  category_id: z.string().min(1, 'La categorie est requise'),
  image_url: z.string().optional(),
  available: z.boolean(),
});

type FormData = z.infer<typeof schema>;

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: FormData) => void;
  onCancel?: () => void;
  loading?: boolean;
}

export function ProductForm({ product, onSubmit, onCancel, loading }: ProductFormProps) {
  const { data: categories } = useCategories();
  const [imageUrl, setImageUrl] = useState(product?.image_url ?? '');

  const { register, handleSubmit, control, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema) as never,
    defaultValues: {
      name_fr: product?.name_fr ?? '',
      name_he: product?.name_he ?? '',
      description_fr: product?.description_fr ?? '',
      description_he: product?.description_he ?? '',
      price: product?.price ?? 0,
      category_id: product?.category_id ?? '',
      image_url: product?.image_url ?? '',
      available: product?.available ?? true,
    },
  });

  const categoryOptions = categories?.map((c) => ({ value: c.id, label: c.name_fr })) ?? [];

  const handleFormSubmit: SubmitHandler<FormData> = (data) => {
    onSubmit({ ...data, image_url: imageUrl || undefined });
  };

  const handleImageUpload = (url: string) => {
    setImageUrl(url);
    setValue('image_url', url);
  };

  const handleImageRemove = () => {
    setImageUrl('');
    setValue('image_url', '');
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Image Section */}
      <div className="pb-6 border-b border-gray-100">
        <ImageUpload
          value={imageUrl}
          onUpload={handleImageUpload}
          onRemove={handleImageRemove}
          label="Image du produit"
          folder="products"
        />
      </div>

      {/* Names Section */}
      <div className="pb-6 border-b border-gray-100">
        <h3 className="text-sm font-medium text-gray-900 mb-4">Informations</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Nom (FR)"
            {...register('name_fr')}
            error={errors.name_fr?.message}
            placeholder="Croissant au beurre"
          />
          <Input
            label="Nom (HE)"
            {...register('name_he')}
            error={errors.name_he?.message}
            dir="rtl"
            placeholder="קרואסון חמאה"
          />
        </div>
      </div>

      {/* Description Section */}
      <div className="pb-6 border-b border-gray-100">
        <h3 className="text-sm font-medium text-gray-900 mb-4">Description</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Textarea
            label="Description (FR)"
            {...register('description_fr')}
            rows={3}
            placeholder="Description en francais..."
          />
          <Textarea
            label="Description (HE)"
            {...register('description_he')}
            rows={3}
            dir="rtl"
            placeholder="תיאור בעברית..."
          />
        </div>
      </div>

      {/* Price & Category Section */}
      <div className="pb-6 border-b border-gray-100">
        <h3 className="text-sm font-medium text-gray-900 mb-4">Prix et categorie</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Prix (₪)"
            type="number"
            step="0.01"
            min="0"
            {...register('price')}
            error={errors.price?.message}
            placeholder="15"
          />
          <Select
            label="Categorie"
            options={categoryOptions}
            {...register('category_id')}
            error={errors.category_id?.message}
            placeholder="Selectionner une categorie"
          />
        </div>
      </div>

      {/* Availability Section */}
      <div className="flex items-center justify-between py-4 px-4 bg-gray-50 rounded-lg">
        <div>
          <p className="font-medium text-gray-900">Disponible a la vente</p>
          <p className="text-sm text-gray-500">Le produit sera visible dans le catalogue</p>
        </div>
        <Controller
          name="available"
          control={control}
          render={({ field }) => (
            <Switch
              checked={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
            Annuler
          </Button>
        )}
        <Button type="submit" loading={loading} className={onCancel ? 'flex-1' : 'w-full'}>
          {product ? 'Mettre a jour' : 'Creer le produit'}
        </Button>
      </div>
    </form>
  );
}
