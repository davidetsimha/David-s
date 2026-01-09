import { type HTMLAttributes, forwardRef, type ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps extends HTMLAttributes<HTMLDivElement> {
  icon: ReactNode;
  label: string;
  value: string | number;
  trend?: { value: number; label: string };
}

export const StatsCard = forwardRef<HTMLDivElement, StatsCardProps>(
  ({ icon, label, value, trend, className = '', ...props }, ref) => {
    const isPositive = trend && trend.value >= 0;

    return (
      <div
        ref={ref}
        className={`
          bg-white rounded-xl border border-gray-100 p-6
          hover:shadow-lg hover:border-gold-200 transition-all duration-300
          ${className}
        `}
        {...props}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 rounded-lg bg-gold-50 text-gold-600">
            {icon}
          </div>
          {trend && (
            <div className={`flex items-center gap-1 text-sm font-medium
              ${isPositive ? 'text-emerald-600' : 'text-red-500'}`}
            >
              {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>

        <p className="text-sm text-gray-500 mb-1">{label}</p>
        <p className="text-2xl font-display font-semibold text-gray-900">{value}</p>

        {trend && (
          <p className="text-xs text-gray-400 mt-2">{trend.label}</p>
        )}
      </div>
    );
  }
);

StatsCard.displayName = 'StatsCard';
