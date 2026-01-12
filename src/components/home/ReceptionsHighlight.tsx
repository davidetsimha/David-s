import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Star, Sparkles, Baby, Heart } from 'lucide-react';
import { ROUTES } from '../../config/routes';

const eventTypes = [
  { key: 'bar_mitzvah', icon: Star, image: '/images/events/bar-mitzvah.jpg' },
  { key: 'bat_mitzvah', icon: Heart, image: '/images/events/bat-mitzvah.jpg' },
  { key: 'brit', icon: Baby, image: '/images/events/brit.jpg' },
  { key: 'private_party', icon: Sparkles, image: '/images/events/private.jpg' },
];

export function ReceptionsHighlight() {
  const { t } = useTranslation();
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  return (
    <section className="py-24 bg-cream-50 relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30z' fill='%23c9a962' fill-opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="container mx-auto px-6 relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="w-16 h-0.5 bg-gold-500 mx-auto mb-6" />
          <h2 className="font-display text-4xl md:text-5xl text-stone-900 mb-4">
            {t('home.receptionsTitle')}
          </h2>
          <p className="text-stone-600 text-lg max-w-xl mx-auto">
            {t('home.receptionsSubtitle')}
          </p>
        </div>

        {/* Event Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
          {eventTypes.map(({ key, icon: Icon, image }, index) => (
            <Link
              key={key}
              to={ROUTES.RECEPTIONS}
              className="group relative aspect-[3/4] overflow-hidden animate-fade-in-up"
              style={{ animationDelay: `${0.2 + index * 0.1}s` }}
            >
              {/* Image with fallback */}
              <div
                className={`absolute inset-0 bg-cover bg-center transition-transform duration-700
                  group-hover:scale-110 ${imgErrors[key] ? 'bg-gradient-to-br from-gold-200 via-cream-100 to-gold-300' : ''}`}
                style={!imgErrors[key] ? { backgroundImage: `url(${image})` } : undefined}
              >
                {imgErrors[key] && (
                  <div className="w-full h-full flex items-center justify-center">
                    <Icon className="w-20 h-20 text-gold-400/60" />
                  </div>
                )}
              </div>
              {/* Hidden img to detect load errors */}
              {!imgErrors[key] && (
                <img
                  src={image}
                  alt=""
                  className="hidden"
                  onError={() => setImgErrors(prev => ({ ...prev, [key]: true }))}
                />
              )}

              {/* Gradient Overlay */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent
                  transition-opacity duration-500 group-hover:opacity-90"
              />

              {/* Gold Border on Hover */}
              <div
                className="absolute inset-4 border border-gold-500/0 transition-all duration-500
                  group-hover:border-gold-500/60"
              />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-end p-8">
                <Icon
                  className="w-10 h-10 text-gold-400 mb-4 transition-transform duration-500
                    group-hover:scale-110 group-hover:text-gold-300"
                />
                <h3 className="font-display text-2xl text-white text-center mb-2">
                  {t(`receptions.eventTypes.${key}`)}
                </h3>
                <div
                  className="w-0 h-0.5 bg-gold-500 transition-all duration-500
                    group-hover:w-16"
                />
              </div>
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center mt-12">
          <Link
            to={ROUTES.RECEPTIONS}
            className="inline-flex items-center gap-3 px-8 py-4 border-2 border-gold-500
              text-gold-600 font-medium tracking-wider uppercase text-sm
              transition-all duration-200 hover:bg-gold-500 hover:text-white"
          >
            {t('receptions.quoteForm.title')}
          </Link>
        </div>
      </div>
    </section>
  );
}
