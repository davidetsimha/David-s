import { useTranslation } from 'react-i18next';
import { FileText, Phone, Mail } from 'lucide-react';
import { QuoteRequestForm } from '../components/receptions/QuoteRequestForm';

export function EventsQuotePage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero */}
      <section className="py-16 md:py-20 px-4 bg-gradient-to-b from-gold-50 to-cream-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-100 rounded-full mb-6">
            <FileText className="w-4 h-4 text-gold-600" />
            <span className="text-sm font-medium text-gold-700">
              {t('quote.badge')}
            </span>
          </div>

          <h1 className="font-display text-4xl md:text-5xl text-stone-900 mb-4">
            {t('quote.title')}
          </h1>

          <p className="text-lg text-stone-600 max-w-2xl mx-auto">
            {t('quote.subtitle')}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-cream-200">
                <h2 className="font-display text-2xl text-stone-900 mb-2">
                  {t('quote.formTitle')}
                </h2>
                <p className="text-stone-500 mb-6">
                  {t('quote.formSubtitle')}
                </p>
                <QuoteRequestForm />
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Info */}
              <div className="bg-gold-50 rounded-2xl p-6 border border-gold-100">
                <h3 className="font-display text-lg text-stone-900 mb-4">
                  {t('quote.contactTitle')}
                </h3>
                <p className="text-sm text-stone-600 mb-4">
                  {t('quote.contactDesc')}
                </p>

                <div className="space-y-3">
                  <a
                    href="tel:+972587819457"
                    className="flex items-center gap-3 text-stone-700 hover:text-gold-700 transition-colors"
                  >
                    <Phone className="w-5 h-5 text-gold-600" />
                    <span>058-781-9457</span>
                  </a>
                  <a
                    href="mailto:info@davids-patisserie.co.il"
                    className="flex items-center gap-3 text-stone-700 hover:text-gold-700 transition-colors"
                  >
                    <Mail className="w-5 h-5 text-gold-600" />
                    <span>info@davids-patisserie.co.il</span>
                  </a>
                </div>
              </div>

              {/* What to expect */}
              <div className="bg-white rounded-2xl p-6 border border-cream-200">
                <h3 className="font-display text-lg text-stone-900 mb-4">
                  {t('quote.processTitle')}
                </h3>

                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-gold-100 text-gold-700 flex items-center justify-center text-sm font-medium shrink-0">
                      1
                    </div>
                    <div>
                      <p className="font-medium text-stone-900 text-sm">
                        {t('quote.step1Title')}
                      </p>
                      <p className="text-sm text-stone-500">
                        {t('quote.step1Desc')}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-gold-100 text-gold-700 flex items-center justify-center text-sm font-medium shrink-0">
                      2
                    </div>
                    <div>
                      <p className="font-medium text-stone-900 text-sm">
                        {t('quote.step2Title')}
                      </p>
                      <p className="text-sm text-stone-500">
                        {t('quote.step2Desc')}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-gold-100 text-gold-700 flex items-center justify-center text-sm font-medium shrink-0">
                      3
                    </div>
                    <div>
                      <p className="font-medium text-stone-900 text-sm">
                        {t('quote.step3Title')}
                      </p>
                      <p className="text-sm text-stone-500">
                        {t('quote.step3Desc')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
