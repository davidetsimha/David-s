import { type HTMLAttributes, forwardRef } from 'react';

type BadgeStatus = 'pending' | 'confirmed' | 'processing' | 'completed' | 'cancelled';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  status?: BadgeStatus;
  variant?: 'default' | 'outline';
}

const statusStyles: Record<BadgeStatus, string> = {
  pending: 'bg-amber-100 text-amber-700 border-amber-200',
  confirmed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  processing: 'bg-blue-100 text-blue-700 border-blue-200',
  completed: 'bg-gold-100 text-gold-700 border-gold-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200',
};

const statusDots: Record<BadgeStatus, string> = {
  pending: 'bg-amber-500',
  confirmed: 'bg-emerald-500',
  processing: 'bg-blue-500',
  completed: 'bg-gold-500',
  cancelled: 'bg-red-500',
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ status = 'pending', variant = 'default', className = '', children, ...props }, ref) => (
    <span
      ref={ref}
      role="status"
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
        text-xs font-medium border transition-colors
        ${variant === 'outline' ? 'bg-transparent' : statusStyles[status]}
        ${className}
      `}
      {...props}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${statusDots[status]}`} aria-hidden="true" />
      {children}
    </span>
  )
);

Badge.displayName = 'Badge';
