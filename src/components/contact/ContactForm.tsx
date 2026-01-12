import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useCreateContact } from '../../hooks/useContact';
import { Input, Textarea, Button } from '../ui';

export function ContactForm() {
  const { t } = useTranslation();
  const { mutate, isPending, isSuccess } = useCreateContact();

  const contactSchema = z.object({
    name: z.string().min(2, t('contact.form.nameError')),
    email: z.string().email(t('contact.form.emailError')),
    phone: z.string().optional(),
    message: z.string().min(10, t('contact.form.messageError')),
  });

  type ContactFormData = z.infer<typeof contactSchema>;

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = (data: ContactFormData) => {
    mutate(data, {
      onSuccess: () => reset(),
    });
  };

  if (isSuccess) {
    return (
      <div className="text-center py-12 px-6 bg-cream-100 rounded-2xl border border-gold-200">
        <div className="text-4xl mb-4">&#10004;</div>
        <h3 className="font-display text-xl text-gold-700 mb-2">{t('contact.form.success')}</h3>
        <p className="text-gold-600/80">{t('contact.form.successMessage')}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input
        label={t('contact.form.nameLabel')}
        placeholder={t('contact.form.namePlaceholder')}
        error={errors.name?.message}
        {...register('name')}
      />

      <Input
        label={t('contact.form.email')}
        type="email"
        placeholder={t('contact.form.emailPlaceholder')}
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        label={t('contact.form.phoneLabel')}
        type="tel"
        placeholder={t('contact.form.phonePlaceholder')}
        error={errors.phone?.message}
        {...register('phone')}
      />

      <Textarea
        label={t('contact.form.message')}
        placeholder={t('contact.form.messagePlaceholder')}
        rows={5}
        error={errors.message?.message}
        {...register('message')}
      />

      <Button type="submit" loading={isPending} className="w-full">
        {t('contact.form.submit')}
      </Button>
    </form>
  );
}
