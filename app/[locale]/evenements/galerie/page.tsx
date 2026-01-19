import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { GalleryContent } from './GalleryContent';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'gallery' });

  const titles: Record<string, string> = {
    fr: "Galerie Evenements | David's Patisserie",
    he: "גלריית אירועים | David's Patisserie",
  };

  const descriptions: Record<string, string> = {
    fr: 'Decouvrez nos creations patissieres pour evenements: buffets, gateaux de celebration, pieces montees. Inspiration pour vos Bar/Bat Mitzvah, Brit et fetes.',
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

interface Creation {
  id: string;
  title_fr: string;
  title_he: string;
  description_fr: string | null;
  description_he: string | null;
  image_url: string;
  event_type?: string;
}

async function getCreations(): Promise<Creation[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('creations')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching creations:', error);
    return [];
  }

  return data || [];
}

export default async function EventsGalleryPage() {
  const creations = await getCreations();

  return <GalleryContent creations={creations} />;
}
