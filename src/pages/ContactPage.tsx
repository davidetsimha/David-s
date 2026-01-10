import { useTranslation } from 'react-i18next';
import { ContactInfo, ContactForm, LocationMap } from '../components/contact';

export function ContactPage() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-b from-cream-100 to-cream-50">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-gold-700 mb-4">
            {t('contact.pageTitle')}
          </h1>
          <p className="text-gold-600/80 text-lg max-w-xl mx-auto">
            {t('contact.pageSubtitle')}
          </p>
          <div className="mt-8 w-24 h-0.5 bg-gold-400 mx-auto" />
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Left Column - Info & Map */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gold-100">
              <h2 className="font-display text-2xl text-gold-700 mb-6">{t('contact.detailsTitle')}</h2>
              <ContactInfo />
            </div>
            <LocationMap />
          </div>

          {/* Right Column - Form */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gold-100">
            <h2 className="font-display text-2xl text-gold-700 mb-6">{t('contact.formTitle')}</h2>
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
