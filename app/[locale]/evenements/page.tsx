import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { EventsHomeContent } from './EventsHomeContent';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'events' });

  const titles: Record<string, string> = {
    fr: "Evenements & Receptions | David's Patisserie",
    he: "אירועים וקייטרינג | David's Patisserie",
  };

  const descriptions: Record<string, string> = {
    fr: 'Service traiteur haut de gamme pour vos evenements: mariages, Bar/Bat Mitzvah, Brit Mila. Patisserie artisanale sous supervision Badatz Beit Yossef a Jerusalem.',
    he: 'שירותי קייטרינג יוקרתיים לאירועים: חתונות, בר/בת מצווה, ברית מילה. קונדיטוריה בוטיק בהשגחת בד"ץ בית יוסף בירושלים.',
  };

  return {
    title: titles[locale] || titles.fr,
    description: descriptions[locale] || descriptions.fr,
    alternates: {
      canonical: `/${locale}/evenements`,
      languages: {
        fr: '/fr/evenements',
        he: '/he/evenements',
      },
    },
    openGraph: {
      title: titles[locale] || titles.fr,
      description: descriptions[locale] || descriptions.fr,
      type: 'website',
      images: ['/images/creations/buffet-traiteur.jpg'],
    },
  };
}

export default function EventsPage() {
  return <EventsHomeContent />;
}
