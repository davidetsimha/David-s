import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useLanguageStore } from '../../stores';
import { Header } from './Header';
import { Footer } from './Footer';
import { MobileMenu } from './MobileMenu';
import { WhatsAppButton } from './WhatsAppButton';

export function PageLayout() {
  const { direction, language } = useLanguageStore();

  useEffect(() => {
    document.documentElement.dir = direction;
    document.documentElement.lang = language;
  }, [direction, language]);

  return (
    <div className="min-h-screen flex flex-col bg-cream-50">
      <Header />
      <MobileMenu />

      <main className="flex-1 pt-16 md:pt-20">
        <Outlet />
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
