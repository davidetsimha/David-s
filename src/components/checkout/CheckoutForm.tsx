import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, Phone } from 'lucide-react';
import { Input } from '../ui/Input';

const checkoutSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(9),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

interface CheckoutFormProps {
  onSubmit: (data: CheckoutFormData) => void;
  isSubmitting?: boolean;
}

export function CheckoutForm({ onSubmit, isSubmitting }: CheckoutFormProps) {
  const { t, i18n } = useTranslation();
  const direction = i18n.dir();

  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  return (
    <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5" dir={direction}>
      <h3 className="font-display text-lg text-stone-800 mb-4">
        {t('checkout.customerInfo')}
      </h3>

      <div className="relative">
        <User className="absolute top-9 text-stone-400 w-5 h-5
          start-3 pointer-events-none" />
        <Input
          {...register('name')}
          label={t('checkout.name')}
          placeholder={t('contact.form.namePlaceholder')}
          className="ps-11"
          error={errors.name?.message}
          disabled={isSubmitting}
        />
      </div>

      <div className="relative">
        <Mail className="absolute top-9 text-stone-400 w-5 h-5
          start-3 pointer-events-none" />
        <Input
          {...register('email')}
          type="email"
          label={t('checkout.email')}
          placeholder="exemple@email.com"
          className="ps-11"
          error={errors.email?.message}
          disabled={isSubmitting}
        />
      </div>

      <div className="relative">
        <Phone className="absolute top-9 text-stone-400 w-5 h-5
          start-3 pointer-events-none" />
        <Input
          {...register('phone')}
          type="tel"
          label={t('checkout.phone')}
          placeholder={t('contact.form.phonePlaceholder')}
          className="ps-11"
          error={errors.phone?.message}
          disabled={isSubmitting}
        />
      </div>
    </form>
  );
}
