import type { Metadata } from 'next';
import { getTranslations, getLocale } from 'next-intl/server';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { FAQAccordionClient } from './FAQAccordionClient';

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'faq' });
  const tNav = await getTranslations({ locale, namespace: 'nav' });

  return {
    title: tNav('faq'),
    description: t('pageSubtitle'),
    alternates: {
      canonical: `/${locale}/faq`,
      languages: {
        fr: '/fr/faq',
        he: '/he/faq',
      },
    },
  };
}

async function getFAQs(locale: string): Promise<FAQItem[]> {
  const supabase = await createClient();
  const isHebrew = locale === 'he';

  const { data: faqs, error } = await supabase
    .from('faqs')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error || !faqs || faqs.length === 0) {
    return [];
  }

  return faqs.map((faq) => ({
    id: faq.id,
    question: isHebrew ? faq.question_he : faq.question_fr,
    answer: isHebrew ? faq.answer_he : faq.answer_fr,
  }));
}

export default async function FAQPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'faq' });

  // Fetch FAQs from Supabase
  let faqItems = await getFAQs(locale);

  // Fallback to i18n if no FAQs in database
  if (faqItems.length === 0) {
    faqItems = [
      {
        id: '1',
        question: t('items.kashrut.question'),
        answer: t('items.kashrut.answer'),
      },
      {
        id: '2',
        question: t('items.delivery.question'),
        answer: t('items.delivery.answer'),
      },
      {
        id: '3',
        question: t('items.advance.question'),
        answer: t('items.advance.answer'),
      },
      {
        id: '4',
        question: t('items.hours.question'),
        answer: t('items.hours.answer'),
      },
      {
        id: '5',
        question: t('items.shabbatDeadline.question'),
        answer: t('items.shabbatDeadline.answer'),
      },
      {
        id: '6',
        question: t('items.eventAdvance.question'),
        answer: t('items.eventAdvance.answer'),
      },
    ];
  }

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

      {/* FAQ Content */}
      <section className="max-w-3xl mx-auto px-4 py-12">
        <FAQAccordionClient items={faqItems} defaultOpenIndex={0} />

        {/* Contact CTA */}
        <div className="mt-12 text-center p-8 bg-cream-100 rounded-2xl border border-gold-200/50">
          <p className="text-gold-700 mb-2">{t('contactCta')}</p>
          <Link
            href={`/${locale}/contact`}
            className="
              inline-flex items-center gap-2
              text-gold-600 font-medium hover:text-gold-700
              underline underline-offset-4 decoration-gold-300
              hover:decoration-gold-500 transition-colors
            "
          >
            {t('contactLink')}
          </Link>
        </div>
      </section>
    </div>
  );
}
