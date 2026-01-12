import { useTranslation } from 'react-i18next';
import { Accordion } from '../components/faq';
import type { FAQItem } from '../components/faq';

export function FAQPage() {
  const { t } = useTranslation();

  const faqItems: FAQItem[] = [
    {
      id: '1',
      question: t('faq.items.kashrut.question'),
      answer: t('faq.items.kashrut.answer'),
    },
    {
      id: '2',
      question: t('faq.items.delivery.question'),
      answer: t('faq.items.delivery.answer'),
    },
    {
      id: '3',
      question: t('faq.items.advance.question'),
      answer: t('faq.items.advance.answer'),
    },
    {
      id: '4',
      question: t('faq.items.custom.question'),
      answer: t('faq.items.custom.answer'),
    },
    {
      id: '5',
      question: t('faq.items.hours.question'),
      answer: t('faq.items.hours.answer'),
    },
    {
      id: '6',
      question: t('faq.items.dietary.question'),
      answer: t('faq.items.dietary.answer'),
    },
  ];
  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero Section */}
      <section className="relative py-16 md:py-20 bg-gradient-to-b from-cream-100 to-cream-50">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-stone-900 mb-4">
            {t('faq.pageTitle')}
          </h1>
          <p className="text-gold-600/80 text-lg max-w-xl mx-auto">
            {t('faq.pageSubtitle')}
          </p>
          <div className="mt-8 w-24 h-0.5 bg-gold-400 mx-auto" />
        </div>
      </section>

      {/* FAQ Content */}
      <section className="max-w-6xl mx-auto px-4 py-12 max-w-3xl">
        <Accordion items={faqItems} defaultOpenIndex={0} />

        {/* Contact CTA */}
        <div className="mt-12 text-center p-8 bg-cream-100 rounded-2xl border border-gold-200/50">
          <p className="text-gold-700 mb-2">{t('faq.contactCta')}</p>
          <a
            href="/contact"
            className="
              inline-flex items-center gap-2
              text-gold-600 font-medium hover:text-gold-700
              underline underline-offset-4 decoration-gold-300
              hover:decoration-gold-500 transition-colors
            "
          >
            {t('faq.contactLink')}
          </a>
        </div>
      </section>
    </div>
  );
}
