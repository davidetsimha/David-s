'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';

export function AboutContent() {
  const t = useTranslations('about');
  const tFooter = useTranslations('footer');

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gold-100 p-8 md:p-12">
        {/* Chef Photo and Name */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-gold-200 shadow-lg mb-6">
            <Image
              src="/images/david-chef.jpg"
              alt={t('chefName')}
              width={224}
              height={224}
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="font-display text-2xl md:text-3xl text-gold-700 text-center">
            {t('chefName')}
          </h2>
        </div>

        {/* Story paragraphs */}
        <div className="space-y-6 text-stone-700 leading-relaxed text-lg">
          <p>{t('story.paragraph1')}</p>
          <p>{t('story.paragraph2')}</p>
          <p>{t('story.paragraph3')}</p>
          <p>{t('story.paragraph4')}</p>
        </div>

        {/* Signature */}
        <div className="mt-12 pt-8 border-t border-gold-100 text-center">
          <p className="font-display text-xl text-gold-600 italic">
            {t('signature')}
          </p>
        </div>
      </div>

      {/* Certification Badge */}
      <div className="mt-8 text-center">
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-cream-100 rounded-full border border-gold-200/50">
          <span className="text-gold-700 font-medium">{tFooter('certification')}</span>
        </div>
      </div>
    </>
  );
}
