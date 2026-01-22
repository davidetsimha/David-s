import { type HTMLAttributes, forwardRef } from 'react';

type Size = 'sm' | 'md' | 'lg';

interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: Size;
}

const sizes: Record<Size, string> = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-3',
};

export const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  ({ size = 'md', className = '', ...props }, ref) => (
    <div
      ref={ref}
      role="status"
      aria-label="Loading"
      className={`
        ${sizes[size]}
        rounded-full border-gold-200 border-t-gold-500
        animate-spin
        ${className}
      `}
      {...props}
    />
  )
);

Spinner.displayName = 'Spinner';

interface SpinnerOverlayProps extends HTMLAttributes<HTMLDivElement> {
  size?: Size;
  label?: string;
}

export const SpinnerOverlay = forwardRef<HTMLDivElement, SpinnerOverlayProps>(
  ({ size = 'lg', label, className = '', ...props }, ref) => (
    <div
      ref={ref}
      className={`
        fixed inset-0 z-50 flex flex-col items-center justify-center gap-4
        bg-cream-50/80 backdrop-blur-sm
        ${className}
      `}
      {...props}
    >
      <Spinner size={size} />
      {label && (
        <p className="text-sm font-medium text-gold-700">{label}</p>
      )}
    </div>
  )
);

SpinnerOverlay.displayName = 'SpinnerOverlay';
