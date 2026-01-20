'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';

interface Creation {
  id: string;
  title_fr: string;
  title_he: string;
  image_url: string;
}

export function CreationsPreview() {
  const t = useTranslations();
  const locale = useLocale();
  const isHebrew = locale === 'he';
  const [creations, setCreations] = useState<Creation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCreations() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('creations')
          .select('id, title_fr, title_he, image_url')
          .order('sort_order', { ascending: true })
          .limit(8);

        if (error) throw error;
        setCreations(data || []);
      } catch (error) {
        console.error('Error fetching creations:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCreations();
  }, []);

  if (isLoading) {
    return (
      <section className="py-16 px-4 bg-cream-100/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-cream-200 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (creations.length === 0) {
    return null;
  }

  return (
    <section className="py-16 px-4 bg-cream-100/50">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display text-2xl md:text-3xl text-stone-900 mb-2">
              {t('events.creationsTitle', { defaultValue: 'Nos Creations' })}
            </h2>
            <p className="text-stone-500">
              {t('events.creationsSubtitle', { defaultValue: 'Un apercu de notre savoir-faire' })}
            </p>
          </div>
          <Link
            href="/evenements/galerie"
            className="hidden sm:inline-flex items-center gap-2 text-gold-600 hover:text-gold-700
              font-medium transition-colors"
          >
            {t('common.viewAll', { defaultValue: 'Voir tout' })}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {creations.map((creation) => (
            <div
              key={creation.id}
              className="group relative aspect-[3/4] bg-cream-200 rounded-xl overflow-hidden shadow-sm"
            >
              <img
                src={creation.image_url}
                alt={isHebrew ? creation.title_he : creation.title_fr}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <h3 className="text-white font-medium text-sm">
                  {isHebrew ? creation.title_he : creation.title_fr}
                </h3>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center sm:hidden">
          <Link
            href="/evenements/galerie"
            className="inline-flex items-center gap-2 text-gold-600 hover:text-gold-700
              font-medium transition-colors"
          >
            {t('common.viewAll', { defaultValue: 'Voir toute la galerie' })}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
