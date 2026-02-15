'use client'

import { useState, useEffect, type ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Menu } from 'lucide-react'
import { QueryProvider } from '@/components/providers/QueryProvider'
import { createClient } from '@/lib/supabase/client'
import { Spinner } from '@/components/ui/Spinner'
import { AdminSidebar } from './components/AdminSidebar'

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const isLoginPage = pathname === '/admin/login'

  // Register service worker for push notifications
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.error('Service Worker registration failed:', err)
      })
    }
  }, [])

  useEffect(() => {
    const supabase = createClient()

    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setIsAuthenticated(!!session)
      setIsLoading(false)

      if (!session && !isLoginPage) {
        router.push('/admin/login')
      }
    }

    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsAuthenticated(!!session)
        if (!session && !isLoginPage) {
          router.push('/admin/login')
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [router, isLoginPage])

  // Login page - no auth required
  if (isLoginPage) {
    return (
      <QueryProvider>
        <div className="min-h-screen bg-slate-50">
          {children}
        </div>
      </QueryProvider>
    )
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Spinner size="lg" />
      </div>
    )
  }

  // Not authenticated
  if (!isAuthenticated) {
    return null
  }

  // Authenticated - show admin layout
  return (
    <QueryProvider>
      <div className="min-h-screen bg-slate-50">
        {/* Mobile header */}
        <header className="lg:hidden fixed top-0 inset-x-0 h-14 bg-white border-b border-gray-100 flex items-center px-4 z-30 shadow-soft">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ms-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            aria-label="Ouvrir le menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 ms-2">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
              <span className="font-display text-white text-xs font-semibold">D</span>
            </div>
            <span className="font-display text-gray-900 text-sm">David's</span>
          </div>
        </header>

        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="lg:ms-64 min-h-screen pt-14 lg:pt-0">
          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </QueryProvider>
  )
}
