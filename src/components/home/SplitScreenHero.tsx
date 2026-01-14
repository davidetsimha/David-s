import { useTranslation } from 'react-i18next';
import { SplitSection } from './SplitSection';
import { ROUTES } from '../../config/routes';

export function SplitScreenHero() {
  const { t } = useTranslation();

  return (
    <section className="relative h-screen min-h-[600px] flex flex-col md:flex-row overflow-hidden">
      {/* Left Section - Événements */}
      <SplitSection
        side="left"
        title={t('home.splitEvents', 'Événements')}
        subtitle={t('home.splitEventsSubtitle', 'Traiteur & Réceptions')}
        description={t('home.splitEventsDesc', 'Mariages, Bar Mitzvah & célébrations sur mesure')}
        image="/images/creations/buffet-traiteur.jpg"
        href={ROUTES.EVENTS}
        cta={t('home.discoverBtn', 'Découvrir nos créations')}
        delay={0}
      />

      {/* Right Section - Boutique */}
      <SplitSection
        side="right"
        title={t('home.splitShop', 'Boutique')}
        subtitle={t('home.splitShopSubtitle', 'Commandez pour Shabbat')}
        description={t('home.splitShopDesc', 'Challot, pâtisseries & délices livrés chez vous')}
        image="/images/gallery/petits-fours-1.jpg"
        href={ROUTES.SHOP}
        cta={t('home.orderBtn', 'Commander pour Shabbat')}
        delay={0.15}
      />

      {/* Central Logo - Overlaid on both sections */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        z-20 pointer-events-none">
        {/* Glow effect behind logo */}
        <div
          className="absolute inset-0 -m-8 rounded-full blur-xl opacity-60"
          style={{
            background: 'radial-gradient(circle, var(--color-cream-50) 0%, transparent 70%)'
          }}
        />

        {/* Logo container with decorative ring */}
        <div className="relative animate-split-reveal" style={{ animationDelay: '0.6s' }}>
          {/* Outer decorative ring */}
          <div className="absolute inset-0 -m-3 rounded-full border-2 border-gold-400/40
            animate-pulse-glow" />

          {/* Inner ring */}
          <div className="absolute inset-0 -m-1.5 rounded-full border border-bronze-400/30" />

          {/* Logo image */}
          <img
            src="/images/logo-ds.jpg"
            alt="David's Pâtisserie"
            className="w-24 h-24 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-full object-cover
              shadow-2xl ring-4 ring-cream-50/90 animate-float-logo"
          />
        </div>
      </div>

      {/* Vertical divider line (desktop only) */}
      <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px
        bg-gradient-to-b from-transparent via-gold-400/30 to-transparent z-10" />

      {/* Horizontal divider line (mobile only) */}
      <div className="md:hidden absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px
        bg-gradient-to-r from-transparent via-gold-400/30 to-transparent z-10" />

      {/* Scroll indicator */}
      <div className="absolute bottom-6 inset-x-0 flex justify-center z-20
        animate-split-reveal" style={{ animationDelay: '1s' }}>
        <div className="flex flex-col items-center gap-2 text-cream-100/60">
          <span className="text-xs tracking-widest uppercase">
            {t('home.scrollDown', 'Défiler')}
          </span>
          <div className="w-px h-8 bg-gradient-to-b from-gold-400/60 to-transparent animate-pulse" />
        </div>
      </div>
    </section>
  );
}
