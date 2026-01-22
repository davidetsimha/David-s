import { forwardRef, useEffect, useRef, type InputHTMLAttributes } from 'react';
import { Check, Minus } from 'lucide-react';

type CheckboxSize = 'sm' | 'md';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'onChange'> {
  checked: boolean;
  onChange: (checked: boolean) => void;
  indeterminate?: boolean;
  label?: string;
  size?: CheckboxSize;
}

const sizes: Record<CheckboxSize, { box: string; icon: string }> = {
  sm: {
    box: 'h-4 w-4',
    icon: 'w-3 h-3',
  },
  md: {
    box: 'h-5 w-5',
    icon: 'w-3.5 h-3.5',
  },
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ checked, onChange, indeterminate = false, label, size = 'md', disabled, className = '', ...props }, forwardedRef) => {
    const internalRef = useRef<HTMLInputElement>(null);
    const ref = (forwardedRef as React.RefObject<HTMLInputElement>) || internalRef;
    const sizeClasses = sizes[size];

    useEffect(() => {
      if (ref.current) {
        ref.current.indeterminate = indeterminate;
      }
    }, [indeterminate, ref]);

    const isActive = checked || indeterminate;

    return (
      <label className={`inline-flex items-center gap-2 ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${className}`}>
        <input
          ref={ref}
          type="checkbox"
          className="sr-only"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          {...props}
        />
        <span
          className={`
            relative inline-flex items-center justify-center rounded
            border-2 transition-all duration-150
            ${sizeClasses.box}
            ${isActive
              ? 'bg-gold-500 border-gold-500'
              : 'bg-white border-gray-300 hover:border-gray-400'
            }
            ${!disabled && 'focus-within:ring-2 focus-within:ring-gold-500/20 focus-within:ring-offset-1'}
          `}
        >
          {indeterminate ? (
            <Minus className={`${sizeClasses.icon} text-white`} strokeWidth={3} />
          ) : checked ? (
            <Check className={`${sizeClasses.icon} text-white`} strokeWidth={3} />
          ) : null}
        </span>
        {label && <span className="text-sm text-gray-700">{label}</span>}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
