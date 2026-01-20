'use client';

import { useForm, type SubmitHandler } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Send, CheckCircle, Loader2, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { EventType } from '@/types';

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
  const t = useTranslations();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

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

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setError(null);
    setIsPending(true);

    try {
      const supabase = createClient();
      const { error: dbError } = await supabase
        .from('quote_requests')
        .insert({ ...data, status: 'new' });

      if (dbError) throw dbError;
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.errorOccurred', { defaultValue: 'Une erreur est survenue' }));
    } finally {
      setIsPending(false);
    }
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Name */}
        <div className="w-full">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            {t('receptions.quoteForm.name')}
          </label>
          <input
            id="name"
            {...register('name')}
            className={`
              w-full h-10 px-3.5 rounded-lg text-sm
              bg-white border transition-all duration-150
              placeholder:text-gray-400 text-gray-900
              focus:outline-none focus:ring-2 focus:ring-offset-0
              ${errors.name
                ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                : 'border-gray-200 hover:border-gray-300 focus:border-gold-400 focus:ring-gold-100'
              }
            `}
          />
          {errors.name && (
            <p className="mt-1.5 text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="w-full">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            {t('receptions.quoteForm.email')}
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className={`
              w-full h-10 px-3.5 rounded-lg text-sm
              bg-white border transition-all duration-150
              placeholder:text-gray-400 text-gray-900
              focus:outline-none focus:ring-2 focus:ring-offset-0
              ${errors.email
                ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                : 'border-gray-200 hover:border-gray-300 focus:border-gold-400 focus:ring-gold-100'
              }
            `}
          />
          {errors.email && (
            <p className="mt-1.5 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Phone */}
        <div className="w-full">
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            {t('receptions.quoteForm.phone')}
          </label>
          <input
            id="phone"
            type="tel"
            {...register('phone')}
            className={`
              w-full h-10 px-3.5 rounded-lg text-sm
              bg-white border transition-all duration-150
              placeholder:text-gray-400 text-gray-900
              focus:outline-none focus:ring-2 focus:ring-offset-0
              ${errors.phone
                ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                : 'border-gray-200 hover:border-gray-300 focus:border-gold-400 focus:ring-gold-100'
              }
            `}
          />
          {errors.phone && (
            <p className="mt-1.5 text-sm text-red-500">{errors.phone.message}</p>
          )}
        </div>

        {/* Event Type */}
        <div className="w-full">
          <label
            htmlFor="event_type"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            {t('receptions.quoteForm.eventType')}
          </label>
          <div className="relative">
            <select
              id="event_type"
              {...register('event_type')}
              className={`
                w-full h-10 ps-3.5 pe-9 rounded-lg appearance-none cursor-pointer text-sm
                bg-white border transition-all duration-150 text-gray-900
                focus:outline-none focus:ring-2 focus:ring-offset-0
                ${errors.event_type
                  ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                  : 'border-gray-200 hover:border-gray-300 focus:border-gold-400 focus:ring-gold-100'
                }
              `}
            >
              <option value="" disabled>
                {t('common.choose')}
              </option>
              {eventOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute end-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
          {errors.event_type && (
            <p className="mt-1.5 text-sm text-red-500">{errors.event_type.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Event Date */}
        <div className="w-full">
          <label
            htmlFor="event_date"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            {t('receptions.quoteForm.eventDate')}
          </label>
          <input
            id="event_date"
            type="date"
            {...register('event_date')}
            className={`
              w-full h-10 px-3.5 rounded-lg text-sm
              bg-white border transition-all duration-150
              placeholder:text-gray-400 text-gray-900
              focus:outline-none focus:ring-2 focus:ring-offset-0
              ${errors.event_date
                ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                : 'border-gray-200 hover:border-gray-300 focus:border-gold-400 focus:ring-gold-100'
              }
            `}
          />
          {errors.event_date && (
            <p className="mt-1.5 text-sm text-red-500">{errors.event_date.message}</p>
          )}
        </div>

        {/* Guest Count */}
        <div className="w-full">
          <label
            htmlFor="guest_count"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            {t('receptions.quoteForm.guestCount')}
          </label>
          <input
            id="guest_count"
            type="number"
            min={1}
            {...register('guest_count')}
            className={`
              w-full h-10 px-3.5 rounded-lg text-sm
              bg-white border transition-all duration-150
              placeholder:text-gray-400 text-gray-900
              focus:outline-none focus:ring-2 focus:ring-offset-0
              ${errors.guest_count
                ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                : 'border-gray-200 hover:border-gray-300 focus:border-gold-400 focus:ring-gold-100'
              }
            `}
          />
          {errors.guest_count && (
            <p className="mt-1.5 text-sm text-red-500">{errors.guest_count.message}</p>
          )}
        </div>
      </div>

      {/* Message */}
      <div className="w-full">
        <label
          htmlFor="message"
          className="block text-sm font-medium text-stone-700 mb-1.5 ps-0.5"
        >
          {t('receptions.quoteForm.message')}
        </label>
        <textarea
          id="message"
          rows={3}
          {...register('message')}
          className="
            w-full px-4 py-3 rounded-lg resize-y min-h-[100px]
            bg-white border transition-all duration-200
            placeholder:text-stone-400 text-stone-900
            focus:outline-none focus:ring-2 focus:ring-offset-1
            border-stone-200 hover:border-gold-300 focus:border-gold-500 focus:ring-gold-200
          "
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isPending}
        className="
          w-full h-12 px-6 inline-flex items-center justify-center font-medium rounded-lg
          transition-all duration-150 ease-out gap-2.5
          focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
          bg-gold-500 text-white hover:bg-gold-600
          shadow-soft hover:shadow-card active:shadow-soft
        "
      >
        {isPending && <Loader2 className="animate-spin h-4 w-4" />}
        <Send className="w-5 h-5" />
        {t('receptions.quoteForm.submit')}
      </button>
    </form>
  );
}
