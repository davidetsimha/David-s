import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Send, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { useCreateQuote } from '../../hooks/useQuotes';
import { useLanguageStore } from '../../stores/languageStore';
import type { EventType } from '../../types';

const schema = z.object({
  name: z.string().min(2, 'Name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(9, 'Phone required'),
  event_type: z.string().min(1, 'Select event type'),
  event_date: z.string().min(1, 'Select date'),
  guest_count: z.coerce.number().min(1, 'At least 1 guest'),
  message: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface QuoteRequestFormProps {
  preselectedType?: EventType;
}

export function QuoteRequestForm({ preselectedType }: QuoteRequestFormProps) {
  const { t } = useLanguageStore();
  const [submitted, setSubmitted] = useState(false);
  const { mutate, isPending } = useCreateQuote();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema) as never,
    defaultValues: { event_type: preselectedType || '' },
  });

  const eventOptions = [
    { value: 'bar_mitzvah', label: t('Bar Mitzvah', 'בר מצווה') },
    { value: 'bat_mitzvah', label: t('Bat Mitzvah', 'בת מצווה') },
    { value: 'brit', label: t('Brit Mila', 'ברית מילה') },
    { value: 'private_party', label: t('Fete Privee', 'מסיבה פרטית') },
  ];

  const onSubmit: SubmitHandler<FormData> = (data) => {
    mutate(data as FormData & { event_type: EventType }, {
      onSuccess: () => setSubmitted(true),
    });
  };

  if (submitted) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="w-16 h-16 text-gold-500 mx-auto mb-4" />
        <h3 className="font-display text-2xl text-gray-900 mb-2">
          {t('Merci!', 'תודה!')}
        </h3>
        <p className="text-gray-600">
          {t('Nous vous contacterons bientot', 'ניצור איתך קשר בהקדם')}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Input
          label={t('Nom complet', 'שם מלא')}
          {...register('name')}
          error={errors.name?.message}
        />
        <Input
          label={t('Email', 'אימייל')}
          type="email"
          {...register('email')}
          error={errors.email?.message}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Input
          label={t('Telephone', 'טלפון')}
          type="tel"
          {...register('phone')}
          error={errors.phone?.message}
        />
        <Select
          label={t('Type d\'evenement', 'סוג אירוע')}
          options={eventOptions}
          placeholder={t('Choisir...', 'בחר...')}
          {...register('event_type')}
          error={errors.event_type?.message}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Input
          label={t('Date', 'תאריך')}
          type="date"
          {...register('event_date')}
          error={errors.event_date?.message}
        />
        <Input
          label={t('Nombre d\'invites', 'מספר אורחים')}
          type="number"
          min={1}
          {...register('guest_count')}
          error={errors.guest_count?.message}
        />
      </div>

      <Textarea
        label={t('Message (optionnel)', 'הודעה (אופציונלי)')}
        {...register('message')}
        rows={3}
      />

      <Button type="submit" loading={isPending} size="lg" className="w-full">
        <Send className="w-5 h-5" />
        {t('Envoyer la demande', 'שלח בקשה')}
      </Button>
    </form>
  );
}
