'use client'

import { useState, useEffect, useRef } from 'react'
import { useLocale } from 'next-intl'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingCart } from 'lucide-react'

export function BoutiqueFloatButton() {
  const locale = useLocale()
  const pathname = usePathname()
  const isRTL = locale === 'he'

  const [isExpanded, setIsExpanded] = useState(false)
  const [mounted, setMounted] = useState(false)

  const isOnBoutique = pathname.includes('/boutique')

  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || isOnBoutique) return

    const openThenClose = () => {
      setIsExpanded(true)
      const t = setTimeout(() => setIsExpanded(false), 4000)
      timeoutsRef.current.push(t)
    }

    timeoutsRef.current.push(setTimeout(openThenClose, 3000))
    intervalRef.current = setInterval(openThenClose, 12000)

    return () => {
      timeoutsRef.current.forEach(clearTimeout)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [mounted, isOnBoutique])

  if (!mounted || isOnBoutique) return null

  const label = isRTL ? 'לחנות' : 'Voir la boutique'

  return (
    <div className="fixed bottom-[76px] end-5 z-50">
      <div className="relative">

        {!isExpanded && (
          <span
            className="absolute inset-0 rounded-full bg-gold-400/40 animate-ping pointer-events-none"
            style={{ animationDuration: '2.5s' }}
          />
        )}

        <Link
          href={`/${locale}/boutique`}
          aria-label={label}
          className={[
            'relative flex items-center h-12 rounded-full overflow-hidden',
            'bg-gold-500 text-white',
            'shadow-lg shadow-gold-500/40',
            'hover:bg-gold-400 hover:shadow-xl hover:shadow-gold-500/50',
            'transition-all duration-500 ease-out',
            isExpanded
              ? 'max-w-[220px] gap-2.5 px-4'
              : 'max-w-[48px] w-12 justify-center px-0',
          ].join(' ')}
        >
          <ShoppingCart className="w-5 h-5 flex-shrink-0" />
          <span
            className={[
              'text-sm font-semibold whitespace-nowrap select-none',
              'transition-opacity duration-300',
              isExpanded ? 'opacity-100 delay-200' : 'opacity-0',
            ].join(' ')}
          >
            {label}
          </span>
        </Link>

      </div>
    </div>
  )
}
