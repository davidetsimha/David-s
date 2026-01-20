import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { ContactInfo } from '@/components/contact/ContactInfo';
import { ContactForm } from '@/components/contact/ContactForm';
import { LocationMap } from '@/components/contact/LocationMap';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact' });
  const tNav = await getTranslations({ locale, namespace: 'nav' });

  return {
    title: tNav('contact'),
    description: t('pageSubtitle'),
    alternates: {
      canonical: `/${locale}/contact`,
      languages: {
        fr: '/fr/contact',
        he: '/he/contact',
      },
    },
  };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact' });

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

      {/* Main Content */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Left Column - Info & Map */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gold-100">
              <h2 className="font-display text-2xl text-gold-700 mb-6">{t('detailsTitle')}</h2>
              <ContactInfo />
            </div>
            <LocationMap />
          </div>

          {/* Right Column - Form */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gold-100">
            <h2 className="font-display text-2xl text-gold-700 mb-6">{t('formTitle')}</h2>
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
