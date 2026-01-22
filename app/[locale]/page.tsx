import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { SplitScreenHero } from '@/components/home/SplitScreenHeroNext';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });

  const titles: Record<string, string> = {
    fr: "David's Pâtisserie - Pâtisserie Française Casher à Jérusalem",
    he: "David's Patisserie - קונדיטוריה צרפתית כשרה בירושלים",
  };

  const descriptions: Record<string, string> = {
    fr: 'Pâtisserie française artisanale sous supervision Badatz Beit Yossef. Commandes pour Chabbat, réceptions et événements à Jérusalem.',
    he: 'קונדיטוריה צרפתית בוטיק בהשגחת בד"ץ בית יוסף. הזמנות לשבת, אירועים וקייטרינג בירושלים.',
  };

  return {
    title: titles[locale] || titles.fr,
    description: descriptions[locale] || descriptions.fr,
    openGraph: {
      title: titles[locale] || titles.fr,
      description: descriptions[locale] || descriptions.fr,
      locale: locale === 'he' ? 'he_IL' : 'fr_FR',
      type: 'website',
      images: [
        {
          url: '/images/og-image.jpg',
          width: 1200,
          height: 630,
          alt: "David's Patisserie",
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[locale] || titles.fr,
      description: descriptions[locale] || descriptions.fr,
    },
    alternates: {
      canonical: `/${locale}`,
      languages: {
        fr: '/fr',
        he: '/he',
      },
    },
  };
}

export default function HomePage() {
  return (
    <main className="h-screen overflow-hidden">
      <SplitScreenHero />
    </main>
  );
}
