import { type InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className = '', ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-stone-700 mb-1.5 ps-0.5"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full px-4 py-3 rounded-lg
            bg-white border transition-all duration-200
            placeholder:text-stone-400 text-stone-900
            focus:outline-none focus:ring-2 focus:ring-offset-1
            ${error
              ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
              : 'border-stone-200 hover:border-gold-300 focus:border-gold-500 focus:ring-gold-200'
            }
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-red-500 ps-0.5">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
