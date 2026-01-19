'use client';

import { useTranslations } from 'next-intl';

export function LocationMap() {
  const t = useTranslations('contact');
  const tFooter = useTranslations('footer');

  return (
    <div className="
      relative w-full h-64 md:h-80 rounded-2xl overflow-hidden
      bg-cream-100 border border-gold-200/50
    ">
      {/* Google Maps - Centre Sapir 6, Jerusalem */}
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3391.5!2d35.21!3d31.78!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzHCsDQ2JzQ4LjAiTiAzNcKwMTInMzYuMCJF!5e0!3m2!1sen!2sil!4v1234567890"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={t('info.address')}
        className="grayscale-[30%] contrast-[1.1]"
      />

      {/* Overlay badge */}
      <div className="
        absolute bottom-4 start-4
        bg-white/95 backdrop-blur-sm
        px-4 py-2 rounded-lg shadow-lg
        border border-gold-200/50
      ">
        <p className="text-sm font-medium text-gold-700">
          David&apos;s Patisserie
        </p>
        <p className="text-xs text-gold-500">{tFooter('address')}</p>
      </div>
    </div>
  );
}
