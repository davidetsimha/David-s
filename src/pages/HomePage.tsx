import {
  HeroSection,
  ReceptionsHighlight,
  ShabbatPreview,
  CertificationBadge,
} from '../components/home';

export function HomePage() {
  return (
    <main>
      <HeroSection />
      <ReceptionsHighlight />
      <ShabbatPreview />
      <CertificationBadge />
    </main>
  );
}
