import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Phone, Mail } from 'lucide-react';
import { QuoteRequestForm } from '../components/receptions/QuoteRequestForm';
import type { EventType } from '../types';

export function EventsQuotePage() {
  const { t } = useTranslation();
  const [selectedType, setSelectedType] = useState<EventType | undefined>();

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero */}
      <section className="py-16 md:py-20 px-4 bg-gradient-to-b from-gold-50 to-cream-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-100 rounded-full mb-6">
            <FileText className="w-4 h-4 text-gold-600" />
            <span className="text-sm font-medium text-gold-700">
              {t('quote.badge', 'Devis gratuit')}
            </span>
          </div>

          <h1 className="font-display text-4xl md:text-5xl text-stone-900 mb-4">
            {t('quote.title', 'Demander un devis')}
          </h1>

          <p className="text-lg text-stone-600 max-w-2xl mx-auto">
            {t('quote.subtitle', 'Décrivez-nous votre événement et recevez une proposition personnalisée sous 48h')}
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
                  {t('quote.formTitle', 'Parlez-nous de votre projet')}
                </h2>
                <p className="text-stone-500 mb-6">
                  {t('quote.formSubtitle', 'Remplissez le formulaire ci-dessous')}
                </p>
                <QuoteRequestForm preselectedType={selectedType} />
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Info */}
              <div className="bg-gold-50 rounded-2xl p-6 border border-gold-100">
                <h3 className="font-display text-lg text-stone-900 mb-4">
                  {t('quote.contactTitle', 'Besoin d\'aide ?')}
                </h3>
                <p className="text-sm text-stone-600 mb-4">
                  {t('quote.contactDesc', 'Notre équipe est disponible pour répondre à vos questions')}
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
                  {t('quote.processTitle', 'Comment ça marche ?')}
                </h3>

                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-gold-100 text-gold-700 flex items-center justify-center text-sm font-medium shrink-0">
                      1
                    </div>
                    <div>
                      <p className="font-medium text-stone-900 text-sm">
                        {t('quote.step1Title', 'Envoyez votre demande')}
                      </p>
                      <p className="text-sm text-stone-500">
                        {t('quote.step1Desc', 'Remplissez le formulaire avec les détails de votre événement')}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-gold-100 text-gold-700 flex items-center justify-center text-sm font-medium shrink-0">
                      2
                    </div>
                    <div>
                      <p className="font-medium text-stone-900 text-sm">
                        {t('quote.step2Title', 'Nous vous contactons')}
                      </p>
                      <p className="text-sm text-stone-500">
                        {t('quote.step2Desc', 'Notre équipe vous recontacte sous 48h pour discuter des détails')}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-gold-100 text-gold-700 flex items-center justify-center text-sm font-medium shrink-0">
                      3
                    </div>
                    <div>
                      <p className="font-medium text-stone-900 text-sm">
                        {t('quote.step3Title', 'Recevez votre devis')}
                      </p>
                      <p className="text-sm text-stone-500">
                        {t('quote.step3Desc', 'Une proposition détaillée adaptée à vos besoins')}
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
