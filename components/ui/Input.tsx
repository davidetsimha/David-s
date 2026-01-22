import { type InputHTMLAttributes, forwardRef, type ReactNode } from 'react';

type InputSize = 'sm' | 'md';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  inputSize?: InputSize;
}

const sizes: Record<InputSize, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-10 px-3.5',
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, inputSize = 'md', id, className = '', ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none text-gray-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`
              w-full rounded-lg text-sm
              bg-white border transition-all duration-150
              placeholder:text-gray-400 text-gray-900
              focus:outline-none focus:ring-2 focus:ring-offset-0
              ${error
                ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                : 'border-gray-200 hover:border-gray-300 focus:border-gold-400 focus:ring-gold-100'
              }
              ${sizes[inputSize]}
              ${icon ? 'ps-9' : ''}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
