import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dihxfbiugfkaeyhbjhea.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  async redirects() {
    return [
      // Legacy routes redirects
      { source: '/receptions', destination: '/evenements', permanent: true },
      { source: '/shabbat', destination: '/boutique', permanent: true },
      { source: '/gallery', destination: '/evenements/galerie', permanent: true },
      { source: '/events', destination: '/evenements', permanent: true },
      // With locale prefix
      { source: '/:locale/receptions', destination: '/:locale/evenements', permanent: true },
      { source: '/:locale/shabbat', destination: '/:locale/boutique', permanent: true },
      { source: '/:locale/gallery', destination: '/:locale/evenements/galerie', permanent: true },
      { source: '/:locale/events', destination: '/:locale/evenements', permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);
