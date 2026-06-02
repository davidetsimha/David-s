import type { Metadata } from 'next';
import { GalleryContent } from './GalleryContent';
import { createClient } from '@/lib/supabase/server';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const titles: Record<string, string> = {
    fr: "Galerie Événements | David's Pâtisserie",
    he: "גלריית אירועים | David's Patisserie",
  };

  const descriptions: Record<string, string> = {
    fr: 'Découvrez nos créations pâtissières pour événements: buffets, gâteaux de célébration, pièces montées. Inspiration pour vos Bar/Bat Mitzvah, Brit et fêtes.',
    he: 'צפו ביצירות הקונדיטוריה שלנו לאירועים: מזנונים, עוגות חגיגיות, מגדלי מאפים. השראה לבר/בת מצווה, ברית וחגיגות.',
  };

  return {
    title: titles[locale] || titles.fr,
    description: descriptions[locale] || descriptions.fr,
    alternates: {
      canonical: `/${locale}/evenements/galerie`,
      languages: {
        fr: '/fr/evenements/galerie',
        he: '/he/evenements/galerie',
      },
    },
    openGraph: {
      title: titles[locale] || titles.fr,
      description: descriptions[locale] || descriptions.fr,
      type: 'website',
    },
  };
}

export default async function EventsGalleryPage() {
  const supabase = await createClient();
  const { data: images } = await supabase
    .from('gallery_images')
    .select('*')
    .order('sort_order', { ascending: true });

  return <GalleryContent images={images ?? []} />;
}
