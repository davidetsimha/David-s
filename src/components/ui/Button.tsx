import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'accent';
type Size = 'sm' | 'md' | 'lg' | 'icon';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variants: Record<Variant, string> = {
  primary: `bg-gold-500 text-white hover:bg-gold-600
    shadow-soft hover:shadow-card active:shadow-soft`,
  secondary: `bg-white text-gray-700 hover:bg-gray-50
    border border-gray-200 hover:border-gray-300 shadow-soft`,
  outline: `bg-transparent text-gold-600 border border-gold-300
    hover:bg-gold-50 hover:border-gold-400`,
  ghost: `bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900`,
  danger: `bg-red-500 text-white hover:bg-red-600
    shadow-soft hover:shadow-card`,
  accent: `bg-transparent text-bronze-600 border-2 border-bronze-500
    hover:bg-bronze-500 hover:text-white hover:shadow-lg hover:shadow-bronze-500/25
    tracking-wide uppercase font-semibold transition-all duration-300`,
};

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-sm gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2.5',
  icon: 'h-9 w-9 p-0',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, children, disabled, className = '', ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center font-medium rounded-lg
        transition-all duration-150 ease-out
        focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      {...props}
    >
      {loading && <Loader2 className="animate-spin h-4 w-4" />}
      {children}
    </button>
  )
);

Button.displayName = 'Button';
