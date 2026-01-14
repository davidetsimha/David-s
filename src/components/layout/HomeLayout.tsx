import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useLanguageStore } from '../../stores';
import { WhatsAppButton } from './WhatsAppButton';
import { PageLoader } from './PageLoader';

export function HomeLayout() {
  const { direction, language } = useLanguageStore();

  useEffect(() => {
    document.documentElement.dir = direction;
    document.documentElement.lang = language;
  }, [direction, language]);

  return (
    <div className="min-h-screen bg-cream-50">
      <PageLoader />

      <Outlet />

      <WhatsAppButton />
    </div>
  );
}
