import type { Metadata } from 'next';
import { QueryProvider } from '@/components/providers/QueryProvider';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: "David's Patisserie - Pâtisserie Française Casher à Jérusalem",
    template: "%s | David's Patisserie",
  },
  description:
    "Pâtisserie française artisanale sous supervision Badatz Beit Yossef. Commandes pour Shabbat, réceptions et événements à Jérusalem.",
  keywords: [
    'pâtisserie',
    'casher',
    'Jérusalem',
    'Shabbat',
    'réceptions',
    'événements',
    'Badatz Beit Yossef',
    'gâteaux',
    'challot',
  ],
  authors: [{ name: "David's Patisserie" }],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    alternateLocale: 'he_IL',
    siteName: "David's Patisserie",
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
