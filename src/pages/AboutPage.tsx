import { useTranslation } from 'react-i18next';

export function AboutPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero Section */}
      <section className="relative py-16 md:py-20 bg-gradient-to-b from-cream-100 to-cream-50">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-stone-900 mb-4">
            {t('about.pageTitle')}
          </h1>
          <p className="text-gold-600/80 text-lg max-w-xl mx-auto">
            {t('about.pageSubtitle')}
          </p>
          <div className="mt-8 w-24 h-0.5 bg-gold-400 mx-auto" />
        </div>
      </section>

      {/* Story Content */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gold-100 p-8 md:p-12">
          {/* Chef Photo and Name */}
          <div className="flex flex-col items-center mb-10">
            <div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-gold-200 shadow-lg mb-6">
              <img
                src="https://davids-patisserie.co.il/wp-content/uploads/2025/12/4300-2.png"
                alt={t('about.chefName')}
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="font-display text-2xl md:text-3xl text-gold-700 text-center">
              {t('about.chefName')}
            </h2>
          </div>

          {/* Story paragraphs */}
          <div className="space-y-6 text-stone-700 leading-relaxed text-lg">
            <p>{t('about.story.paragraph1')}</p>
            <p>{t('about.story.paragraph2')}</p>
            <p>{t('about.story.paragraph3')}</p>
            <p>{t('about.story.paragraph4')}</p>
          </div>

          {/* Signature */}
          <div className="mt-12 pt-8 border-t border-gold-100 text-center">
            <p className="font-display text-xl text-gold-600 italic">
              {t('about.signature')}
            </p>
          </div>
        </div>

        {/* Certification Badge */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-cream-100 rounded-full border border-gold-200/50">
            <span className="text-gold-700 font-medium">{t('footer.certification')}</span>
          </div>
        </div>
      </section>
    </div>
  );
}
