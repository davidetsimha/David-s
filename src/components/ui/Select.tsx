import { type SelectHTMLAttributes, forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

type SelectSize = 'sm' | 'md';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  selectSize?: SelectSize;
}

const sizes: Record<SelectSize, string> = {
  sm: 'h-9 ps-3 pe-8 text-sm',
  md: 'h-10 ps-3.5 pe-9',
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, selectSize = 'md', id, className = '', ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={`
              w-full rounded-lg appearance-none cursor-pointer text-sm
              bg-white border transition-all duration-150 text-gray-900
              focus:outline-none focus:ring-2 focus:ring-offset-0
              ${error
                ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                : 'border-gray-200 hover:border-gray-300 focus:border-gold-400 focus:ring-gold-100'
              }
              ${sizes[selectSize]}
              ${className}
            `}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute end-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
