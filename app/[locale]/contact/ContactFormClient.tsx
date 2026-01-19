'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { Loader2 } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export function ContactFormClient() {
  const t = useTranslations('contact');
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const contactSchema = z.object({
    name: z.string().min(2, t('form.nameError')),
    email: z.string().email(t('form.emailError')),
    phone: z.string().optional(),
    message: z.string().min(10, t('form.messageError')),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsPending(true);
    setError(null);

    try {
      const { error: insertError } = await supabase
        .from('contact_messages')
        .insert({ ...data, read: false });

      if (insertError) throw insertError;

      setIsSuccess(true);
      reset();
    } catch (err) {
      setError(t('form.messageError'));
    } finally {
      setIsPending(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-12 px-6 bg-cream-100 rounded-2xl border border-gold-200">
        <div className="text-4xl mb-4">&#10004;</div>
        <h3 className="font-display text-xl text-gold-700 mb-2">{t('form.success')}</h3>
        <p className="text-gold-600/80">{t('form.successMessage')}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Name */}
      <div className="w-full">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-1.5"
        >
          {t('form.nameLabel')}
        </label>
        <input
          id="name"
          type="text"
          placeholder={t('form.namePlaceholder')}
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
          {...register('name')}
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
          {t('form.email')}
        </label>
        <input
          id="email"
          type="email"
          placeholder={t('form.emailPlaceholder')}
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
          {...register('email')}
        />
        {errors.email && (
          <p className="mt-1.5 text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      {/* Phone */}
      <div className="w-full">
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700 mb-1.5"
        >
          {t('form.phoneLabel')}
        </label>
        <input
          id="phone"
          type="tel"
          placeholder={t('form.phonePlaceholder')}
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
          {...register('phone')}
        />
        {errors.phone && (
          <p className="mt-1.5 text-sm text-red-500">{errors.phone.message}</p>
        )}
      </div>

      {/* Message */}
      <div className="w-full">
        <label
          htmlFor="message"
          className="block text-sm font-medium text-stone-700 mb-1.5 ps-0.5"
        >
          {t('form.message')}
        </label>
        <textarea
          id="message"
          placeholder={t('form.messagePlaceholder')}
          rows={5}
          className={`
            w-full px-4 py-3 rounded-lg resize-y min-h-[100px]
            bg-white border transition-all duration-200
            placeholder:text-stone-400 text-stone-900
            focus:outline-none focus:ring-2 focus:ring-offset-1
            ${errors.message
              ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
              : 'border-stone-200 hover:border-gold-300 focus:border-gold-500 focus:ring-gold-200'
            }
          `}
          {...register('message')}
        />
        {errors.message && (
          <p className="mt-1.5 text-sm text-red-500 ps-0.5">{errors.message.message}</p>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-500 text-center">{error}</p>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isPending}
        className="
          w-full inline-flex items-center justify-center font-medium rounded-lg
          transition-all duration-150 ease-out
          focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
          bg-gold-500 text-white hover:bg-gold-600
          shadow-soft hover:shadow-card active:shadow-soft
          h-10 px-4 text-sm gap-2
        "
      >
        {isPending && <Loader2 className="animate-spin h-4 w-4" />}
        {t('form.submit')}
      </button>
    </form>
  );
}
