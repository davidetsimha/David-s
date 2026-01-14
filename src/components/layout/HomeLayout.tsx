import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useLanguageStore } from '../../stores';
import { WhatsAppButton } from './WhatsAppButton';
import { PageLoader } from './PageLoader';
import { useState } from 'react';

export function HomeLayout() {
  const { direction, language } = useLanguageStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.documentElement.dir = direction;
    document.documentElement.lang = language;
  }, [direction, language]);

  return (
    <div className="min-h-screen bg-cream-50">
      <PageLoader onComplete={() => setIsLoading(false)} />

      <Outlet />

      <WhatsAppButton />
    </div>
  );
}
