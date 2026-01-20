import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { AboutContent } from '@/components/about/AboutContent';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });
  const tNav = await getTranslations({ locale, namespace: 'nav' });

  return {
    title: tNav('about'),
    description: t('pageSubtitle'),
    alternates: {
      canonical: `/${locale}/about`,
      languages: {
        fr: '/fr/about',
        he: '/he/about',
      },
    },
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero Section */}
      <section className="relative py-16 md:py-20 bg-gradient-to-b from-cream-100 to-cream-50">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-stone-900 mb-4">
            {t('pageTitle')}
          </h1>
          <p className="text-gold-600/80 text-lg max-w-xl mx-auto">
            {t('pageSubtitle')}
          </p>
          <div className="mt-8 w-24 h-0.5 bg-gold-400 mx-auto" />
        </div>
      </section>

      {/* Story Content */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <AboutContent />
      </section>
    </div>
  );
}
