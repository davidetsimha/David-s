import { forwardRef, type InputHTMLAttributes } from 'react';

type SwitchSize = 'sm' | 'md';

interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'onChange'> {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  size?: SwitchSize;
}

const sizes: Record<SwitchSize, { track: string; thumb: string; translate: string }> = {
  sm: {
    track: 'h-5 w-9',
    thumb: 'h-4 w-4',
    translate: 'translate-x-4',
  },
  md: {
    track: 'h-6 w-11',
    thumb: 'h-5 w-5',
    translate: 'translate-x-5',
  },
};

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ checked, onChange, label, description, size = 'md', disabled, className = '', ...props }, ref) => {
    const sizeClasses = sizes[size];

    return (
      <label className={`inline-flex items-center gap-3 ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${className}`}>
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
            relative inline-flex shrink-0 items-center rounded-full
            transition-colors duration-200 ease-in-out
            focus-within:ring-2 focus-within:ring-gold-500 focus-within:ring-offset-2
            ${sizeClasses.track}
            ${checked ? 'bg-gold-500' : 'bg-gray-200'}
          `}
        >
          <span
            className={`
              inline-block rounded-full bg-white shadow-sm
              transform transition-transform duration-200 ease-in-out
              ${sizeClasses.thumb}
              ${checked ? sizeClasses.translate : 'translate-x-0.5'}
            `}
          />
        </span>
        {(label || description) && (
          <span className="flex flex-col">
            {label && <span className="text-sm font-medium text-gray-900">{label}</span>}
            {description && <span className="text-xs text-gray-500">{description}</span>}
          </span>
        )}
      </label>
    );
  }
);

Switch.displayName = 'Switch';
