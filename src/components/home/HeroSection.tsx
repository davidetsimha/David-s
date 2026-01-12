import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../config/routes';

export function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="relative h-screen min-h-[700px] overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          poster="/images/hero-poster.jpg"
        >
          <source src="/videos/patisserie-hero.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Luxurious Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />

      {/* Decorative Gold Frame */}
      <div className="absolute inset-8 border border-gold-500/20 pointer-events-none" />
      <div className="absolute inset-12 border border-gold-500/10 pointer-events-none" />

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center px-6">
        {/* Gold Accent Line */}
        <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent mb-8" />

        {/* Main Title */}
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-white text-center leading-tight">
          <span className="block animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            {t('home.heroTitle')}
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className="mt-6 text-lg md:text-xl text-cream-100/90 text-center max-w-2xl
            font-light tracking-wide animate-fade-in-up"
          style={{ animationDelay: '0.4s' }}
        >
          {t('home.heroSubtitle')}
        </p>

        {/* Gold Accent Line */}
        <div
          className="w-16 h-0.5 bg-gradient-to-r from-transparent via-gold-400 to-transparent
            my-10 animate-fade-in-up"
          style={{ animationDelay: '0.5s' }}
        />

        {/* CTA Buttons */}
        <div
          className="flex flex-col sm:flex-row gap-4 animate-fade-in-up"
          style={{ animationDelay: '0.6s' }}
        >
          <Link
            to={ROUTES.RECEPTIONS}
            className="group relative px-10 py-4 bg-gold-500 text-white font-medium
              tracking-wider uppercase text-sm overflow-hidden transition-all duration-200
              hover:bg-gold-400 hover:shadow-lg hover:shadow-gold-500/25"
          >
            <span className="relative z-10">{t('home.discoverBtn')}</span>
            <div
              className="absolute inset-0 bg-gradient-to-r from-gold-600 to-gold-400
                translate-x-full group-hover:translate-x-0 transition-transform duration-500"
            />
          </Link>

          <Link
            to={ROUTES.SHABBAT}
            className="group px-10 py-4 border-2 border-white/80 text-white font-medium
              tracking-wider uppercase text-sm transition-all duration-200
              hover:bg-white hover:text-stone-900 hover:border-white"
          >
            {t('home.orderBtn')}
          </Link>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 inset-x-0 flex justify-center">
        <div className="w-px h-12 bg-gradient-to-b from-gold-500/50 to-transparent animate-pulse" />
      </div>
    </section>
  );
}
