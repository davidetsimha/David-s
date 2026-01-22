import { type HTMLAttributes, forwardRef } from 'react';

type BadgeStatus = 'pending' | 'confirmed' | 'processing' | 'completed' | 'cancelled' | 'default';
type BadgeSize = 'sm' | 'md';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  status?: BadgeStatus;
  size?: BadgeSize;
  dot?: boolean;
}

const statusStyles: Record<BadgeStatus, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200/60',
  confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
  processing: 'bg-blue-50 text-blue-700 border-blue-200/60',
  completed: 'bg-gold-50 text-gold-700 border-gold-200/60',
  cancelled: 'bg-red-50 text-red-600 border-red-200/60',
  default: 'bg-gray-50 text-gray-600 border-gray-200/60',
};

const statusDots: Record<BadgeStatus, string> = {
  pending: 'bg-amber-500',
  confirmed: 'bg-emerald-500',
  processing: 'bg-blue-500',
  completed: 'bg-gold-500',
  cancelled: 'bg-red-500',
  default: 'bg-gray-400',
};

const sizes: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ status = 'default', size = 'md', dot = true, className = '', children, ...props }, ref) => (
    <span
      ref={ref}
      role="status"
      className={`
        inline-flex items-center gap-1.5 rounded-full
        font-medium border
        ${statusStyles[status]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${statusDots[status]}`} aria-hidden="true" />
      )}
      {children}
    </span>
  )
);

Badge.displayName = 'Badge';
