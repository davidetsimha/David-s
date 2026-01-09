import { type TextareaHTMLAttributes, forwardRef } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, id, className = '', rows = 4, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-gray-700 mb-1.5 ps-0.5"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={`
            w-full px-4 py-3 rounded-lg resize-y min-h-[100px]
            bg-white border transition-all duration-200
            placeholder:text-gray-400 text-gray-900
            focus:outline-none focus:ring-2 focus:ring-offset-1
            ${error
              ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
              : 'border-gray-200 hover:border-gold-300 focus:border-gold-500 focus:ring-gold-200'
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

Textarea.displayName = 'Textarea';
