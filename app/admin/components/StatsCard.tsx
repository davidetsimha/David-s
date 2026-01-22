'use client'

import { type HTMLAttributes, forwardRef, type ReactNode } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface StatsCardProps extends HTMLAttributes<HTMLDivElement> {
  icon: ReactNode
  label: string
  value: string | number
  trend?: { value: number; label: string }
}

export const StatsCard = forwardRef<HTMLDivElement, StatsCardProps>(
  ({ icon, label, value, trend, className = '', ...props }, ref) => {
    const isPositive = trend && trend.value >= 0

    return (
      <div
        ref={ref}
        className={`
          bg-white rounded-xl border border-gray-100 shadow-card p-5
          transition-all duration-150
          ${className}
        `}
        {...props}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="p-2.5 rounded-lg bg-gold-50/80 text-gold-600">
            {icon}
          </div>
          {trend && (
            <div className={`
              inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium
              ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}
            `}>
              {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>

        <p className="text-3xl font-semibold text-gray-900 tracking-tight">{value}</p>
        <p className="text-sm text-gray-500 mt-1">{label}</p>

        {trend && (
          <p className="text-xs text-gray-400 mt-3 pt-3 border-t border-gray-50">{trend.label}</p>
        )}
      </div>
    )
  }
)

StatsCard.displayName = 'StatsCard'
