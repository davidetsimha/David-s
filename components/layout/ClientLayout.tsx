'use client';

import { useState, useCallback } from 'react';
import { PageLoader } from './PageLoader';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const [showLoader, setShowLoader] = useState(true);

  const handleLoaderComplete = useCallback(() => {
    setShowLoader(false);
  }, []);

  return (
    <>
      {showLoader && <PageLoader onComplete={handleLoaderComplete} />}
      {children}
    </>
  );
}
