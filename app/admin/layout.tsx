import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { AdminShell } from './AdminShell'

// Linking the manifest makes the admin installable as a standalone PWA.
// Required for push notifications on iOS (only available to Home Screen web apps).
export const metadata: Metadata = {
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: "David's Admin",
    statusBarStyle: 'default',
  },
  icons: {
    apple: '/icons/icon-192x192.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#d4a853',
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminShell>{children}</AdminShell>
}
