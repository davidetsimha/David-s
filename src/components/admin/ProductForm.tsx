import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { useCategories } from '../../hooks/useCategories';
import type { Product } from '../../types';

const schema = z.object({
  name_fr: z.string().min(1, 'French name is required'),
  name_he: z.string().min(1, 'Hebrew name is required'),
  description_fr: z.string().optional(),
  description_he: z.string().optional(),
  price: z.coerce.number().min(0, 'Price must be positive'),
  category_id: z.string().min(1, 'Category is required'),
  image_url: z.string().url().optional().or(z.literal('')),
  available: z.boolean(),
});

type FormData = z.infer<typeof schema>;

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: FormData) => void;
  loading?: boolean;
}

export function ProductForm({ product, onSubmit, loading }: ProductFormProps) {
  const { data: categories } = useCategories();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
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
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <Input label="Name (FR)" {...register('name_fr')} error={errors.name_fr?.message} />
        <Input label="Name (HE)" {...register('name_he')} error={errors.name_he?.message} dir="rtl" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Textarea label="Description (FR)" {...register('description_fr')} rows={3} />
        <Textarea label="Description (HE)" {...register('description_he')} rows={3} dir="rtl" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input label="Price" type="number" step="0.01" {...register('price')} error={errors.price?.message} />
        <Select label="Category" options={categoryOptions} {...register('category_id')} error={errors.category_id?.message} />
      </div>

      <Input label="Image URL" {...register('image_url')} placeholder="https://..." />

      <label className="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" {...register('available')} className="w-5 h-5 rounded border-gray-300 text-gold-500 focus:ring-gold-500" />
        <span className="text-sm font-medium text-gray-700">Available for sale</span>
      </label>

      <div className="pt-4 border-t border-gray-100">
        <Button type="submit" loading={loading} className="w-full">
          {product ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
}
