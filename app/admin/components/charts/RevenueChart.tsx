'use client'

import { useState, useEffect } from 'react'
import { Loader2, TrendingUp, TrendingDown } from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'
import { useRevenueAnalytics } from '@/hooks/useOrders'

export function RevenueChart() {
  const [days, setDays] = useState(7)
  const { data, isLoading } = useRevenueAnalytics(days)
  const [isAnimated, setIsAnimated] = useState(false)

  useEffect(() => {
    if (data && !isAnimated) {
      setTimeout(() => setIsAnimated(true), 100)
    }
  }, [data, isAnimated])

  useEffect(() => {
    setIsAnimated(false)
  }, [days])

  const totalRevenue = data?.reduce((sum, d) => sum + d.revenue, 0) ?? 0
  const totalOrders = data?.reduce((sum, d) => sum + d.orders, 0) ?? 0

  const midpoint = Math.floor((data?.length ?? 0) / 2)
  const firstHalfRevenue = data?.slice(0, midpoint).reduce((sum, d) => sum + d.revenue, 0) ?? 0
  const secondHalfRevenue = data?.slice(midpoint).reduce((sum, d) => sum + d.revenue, 0) ?? 0
  const trend = firstHalfRevenue > 0 ? Math.round(((secondHalfRevenue - firstHalfRevenue) / firstHalfRevenue) * 100) : 0

  const formatDay = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const chartData = data?.map(d => ({
    ...d,
    name: formatDay(d.date),
  })) ?? []

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ payload: { revenue: number; orders: number } }>; label?: string }) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload
      return (
        <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl px-4 py-3 shadow-elevated">
          <p className="text-xs text-gray-500 mb-1">{label}</p>
          <p className="text-lg font-semibold text-gray-900">{formatCurrency(d.revenue)}</p>
          <p className="text-xs text-gray-500 mt-1">{d.orders} commande{d.orders > 1 ? 's' : ''}</p>
        </div>
      )
    }
    return null
  }

  const CustomDot = (props: { cx?: number; cy?: number; payload?: { revenue: number } }) => {
    const { cx, cy, payload } = props
    if (payload && payload.revenue > 0 && cx && cy) {
      return (
        <g>
          <circle cx={cx} cy={cy} r={4} fill="#c9a962" stroke="#fff" strokeWidth={2} />
        </g>
      )
    }
    return null
  }

  const CustomActiveDot = (props: { cx?: number; cy?: number }) => {
    const { cx, cy } = props
    if (cx && cy) {
      return (
        <g>
          <circle cx={cx} cy={cy} r={8} fill="#c9a962" opacity={0.2} />
          <circle cx={cx} cy={cy} r={5} fill="#c9a962" stroke="#fff" strokeWidth={2} />
        </g>
      )
    }
    return null
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Chiffre d&apos;affaires</h3>
          <div className="flex items-baseline gap-3 mt-1">
            <span className="text-3xl font-semibold text-gray-900">{formatCurrency(totalRevenue)}</span>
            {trend !== 0 && (
              <span className={`flex items-center gap-1 text-sm font-medium px-2 py-0.5 rounded-full ${
                trend > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
              }`}>
                {trend > 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                {trend > 0 ? '+' : ''}{trend}%
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">{totalOrders} commande{totalOrders > 1 ? 's' : ''}</p>
        </div>
        <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
          {[7, 14, 30].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                days === d
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {d}j
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-gold-500" />
        </div>
      ) : (
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#c9a962" stopOpacity={0.3} />
                  <stop offset="50%" stopColor="#c9a962" stopOpacity={0.1} />
                  <stop offset="100%" stopColor="#c9a962" stopOpacity={0} />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f1f5f9"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                tickFormatter={(value) => value >= 1000 ? `${value/1000}k` : value}
                dx={-5}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e5e7eb', strokeDasharray: '4 4' }} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#c9a962"
                strokeWidth={2.5}
                fill="url(#revenueGradient)"
                dot={<CustomDot />}
                activeDot={<CustomActiveDot />}
                animationDuration={1500}
                animationEasing="ease-out"
                isAnimationActive={true}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
