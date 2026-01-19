import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, localeDirections, type Locale } from '@/i18n/config';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const titles: Record<Locale, string> = {
    fr: "David's Patisserie - Pâtisserie Française Casher à Jérusalem",
    he: "David's Patisserie - קונדיטוריה צרפתית כשרה בירושלים",
  };

  const descriptions: Record<Locale, string> = {
    fr: 'Pâtisserie française artisanale sous supervision Badatz Beit Yossef. Commandes pour Shabbat, réceptions et événements à Jérusalem.',
    he: 'קונדיטוריה צרפתית בוטיק בהשגחת בד"ץ בית יוסף. הזמנות לשבת, אירועים וקייטרינג בירושלים.',
  };

  return {
    title: {
      default: titles[locale as Locale] || titles.fr,
      template: "%s | David's Patisserie",
    },
    description: descriptions[locale as Locale] || descriptions.fr,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        fr: '/fr',
        he: '/he',
      },
    },
    openGraph: {
      locale: locale === 'he' ? 'he_IL' : 'fr_FR',
      alternateLocale: locale === 'he' ? 'fr_FR' : 'he_IL',
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();
  const dir = localeDirections[locale as Locale];

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
