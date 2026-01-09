import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, Phone } from 'lucide-react';
import { useLanguageStore } from '../../stores';
import { Input } from '../ui/Input';

const checkoutSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(9, 'Phone is required'),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

interface CheckoutFormProps {
  onSubmit: (data: CheckoutFormData) => void;
  isSubmitting?: boolean;
}

export function CheckoutForm({ onSubmit, isSubmitting }: CheckoutFormProps) {
  const { t, direction } = useLanguageStore();

  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" dir={direction}>
      <h3 className="font-display text-lg text-stone-800 mb-4">
        {t('Vos informations', 'הפרטים שלך')}
      </h3>

      <div className="relative">
        <User className="absolute top-3.5 text-stone-400 w-5 h-5
          start-3 pointer-events-none" />
        <Input
          {...register('name')}
          placeholder={t('Nom complet', 'שם מלא')}
          className="ps-11"
          error={errors.name?.message}
          disabled={isSubmitting}
        />
      </div>

      <div className="relative">
        <Mail className="absolute top-3.5 text-stone-400 w-5 h-5
          start-3 pointer-events-none" />
        <Input
          {...register('email')}
          type="email"
          placeholder={t('Adresse email', 'כתובת אימייל')}
          className="ps-11"
          error={errors.email?.message}
          disabled={isSubmitting}
        />
      </div>

      <div className="relative">
        <Phone className="absolute top-3.5 text-stone-400 w-5 h-5
          start-3 pointer-events-none" />
        <Input
          {...register('phone')}
          type="tel"
          placeholder={t('Numéro de téléphone', 'מספר טלפון')}
          className="ps-11"
          error={errors.phone?.message}
          disabled={isSubmitting}
        />
      </div>
    </form>
  );
}
