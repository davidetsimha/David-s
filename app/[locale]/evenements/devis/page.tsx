import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { QuoteContent } from './QuoteContent';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'quote' });

  const titles: Record<string, string> = {
    fr: "Demander un Devis | David's Patisserie",
    he: "בקשת הצעת מחיר | David's Patisserie",
  };

  const descriptions: Record<string, string> = {
    fr: 'Demandez un devis gratuit pour votre evenement: Bar/Bat Mitzvah, Brit Mila, mariage ou fete privee. Reponse personnalisee sous 48h.',
    he: 'בקשו הצעת מחיר חינם לאירוע שלכם: בר/בת מצווה, ברית מילה, חתונה או אירוע פרטי. מענה מותאם אישית תוך 48 שעות.',
  };

  return {
    title: titles[locale] || titles.fr,
    description: descriptions[locale] || descriptions.fr,
    alternates: {
      canonical: `/${locale}/evenements/devis`,
      languages: {
        fr: '/fr/evenements/devis',
        he: '/he/evenements/devis',
      },
    },
    openGraph: {
      title: titles[locale] || titles.fr,
      description: descriptions[locale] || descriptions.fr,
      type: 'website',
    },
  };
}

export default function EventsQuotePage() {
  return <QuoteContent />;
}
