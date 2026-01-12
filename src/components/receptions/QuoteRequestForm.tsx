import { useForm, type SubmitHandler } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Send, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { useCreateQuote } from '../../hooks/useQuotes';
import type { EventType } from '../../types';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(9),
  event_type: z.enum(['bar_mitzvah', 'bat_mitzvah', 'brit', 'private_party']),
  event_date: z.string().min(1),
  guest_count: z.coerce.number().min(1),
  message: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface QuoteRequestFormProps {
  preselectedType?: EventType;
}

export function QuoteRequestForm({ preselectedType }: QuoteRequestFormProps) {
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { mutate, isPending } = useCreateQuote();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema) as never,
    defaultValues: { event_type: preselectedType },
  });

  const eventOptions = [
    { value: 'bar_mitzvah', label: t('receptions.eventTypes.bar_mitzvah') },
    { value: 'bat_mitzvah', label: t('receptions.eventTypes.bat_mitzvah') },
    { value: 'brit', label: t('receptions.eventTypes.brit') },
    { value: 'private_party', label: t('receptions.eventTypes.private_party') },
  ];

  const onSubmit: SubmitHandler<FormData> = (data) => {
    setError(null);
    mutate(data as FormData & { event_type: EventType }, {
      onSuccess: () => setSubmitted(true),
      onError: (err) => setError(err instanceof Error ? err.message : t('common.errorOccurred')),
    });
  };

  if (submitted) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="w-16 h-16 text-gold-500 mx-auto mb-4" />
        <h3 className="font-display text-2xl text-stone-900 mb-2">
          {t('common.thanksTitle')}
        </h3>
        <p className="text-stone-600">
          {t('common.thanksMessage')}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit as SubmitHandler<FormData>)} className="space-y-5">
      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Input
          label={t('receptions.quoteForm.name')}
          {...register('name')}
          error={errors.name?.message}
        />
        <Input
          label={t('receptions.quoteForm.email')}
          type="email"
          {...register('email')}
          error={errors.email?.message}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Input
          label={t('receptions.quoteForm.phone')}
          type="tel"
          {...register('phone')}
          error={errors.phone?.message}
        />
        <Select
          label={t('receptions.quoteForm.eventType')}
          options={eventOptions}
          placeholder={t('common.choose')}
          {...register('event_type')}
          error={errors.event_type?.message}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Input
          label={t('receptions.quoteForm.eventDate')}
          type="date"
          {...register('event_date')}
          error={errors.event_date?.message}
        />
        <Input
          label={t('receptions.quoteForm.guestCount')}
          type="number"
          min={1}
          {...register('guest_count')}
          error={errors.guest_count?.message}
        />
      </div>

      <Textarea
        label={t('receptions.quoteForm.message')}
        {...register('message')}
        rows={3}
      />

      <Button type="submit" loading={isPending} size="lg" className="w-full">
        <Send className="w-5 h-5" />
        {t('receptions.quoteForm.submit')}
      </Button>
    </form>
  );
}
