import { useTranslation } from 'react-i18next';
import { Shield } from 'lucide-react';

export function CertificationBadge() {
  const { t } = useTranslation();

  return (
    <section className="py-16 bg-gradient-to-b from-stone-900 to-stone-950 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #c9a962 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="container mx-auto px-6 relative">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
          {/* Badge Icon */}
          <div className="relative">
            {/* Outer Ring */}
            <div
              className="absolute inset-0 rounded-full border-2 border-gold-500/30
                animate-pulse"
              style={{ transform: 'scale(1.3)' }}
            />
            {/* Inner Badge */}
            <div
              className="relative w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br
                from-gold-400 via-gold-500 to-gold-600 flex items-center justify-center
                shadow-lg shadow-gold-500/20"
            >
              <Shield className="w-12 h-12 md:w-14 md:h-14 text-white" />
            </div>
            {/* Decorative Dots */}
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-gold-400 rounded-full" />
            <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-gold-500 rounded-full" />
          </div>

          {/* Text Content */}
          <div className="text-center md:text-start">
            <p className="text-gold-400 uppercase tracking-[0.3em] text-sm mb-2">
              Certification
            </p>
            <h3 className="font-display text-2xl md:text-3xl text-white mb-2">
              {t('footer.certification')}
            </h3>
            <p className="text-stone-400 text-sm max-w-md">
              {t('footer.delivery')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
