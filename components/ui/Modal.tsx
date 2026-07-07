import { type HTMLAttributes, forwardRef, useEffect, useRef, useState, useCallback, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: ModalSize;
  footer?: ReactNode;
}

const sizes: Record<ModalSize, string> = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  ({ open, onClose, title, description, size = 'md', footer, className = '', children, ...props }, ref) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const previousActiveElement = useRef<HTMLElement | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(true);
    }, []);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key !== 'Tab' || !modalRef.current) return;

      const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    }, [onClose]);

    useEffect(() => {
      if (open) {
        document.body.style.overflow = 'hidden';
        previousActiveElement.current = document.activeElement as HTMLElement;

        setTimeout(() => {
          const firstFocusable = modalRef.current?.querySelector<HTMLElement>(
            'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
          );
          firstFocusable?.focus();
        }, 50);

        window.addEventListener('keydown', handleKeyDown);
        return () => {
          document.body.style.overflow = '';
          window.removeEventListener('keydown', handleKeyDown);
        };
      } else {
        previousActiveElement.current?.focus();
      }
    }, [open, handleKeyDown]);

    if (!open || !mounted) return null;

    return createPortal(
      <div className="fixed inset-0 z-50 flex items-center justify-center sm:p-4">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-gray-900/40 backdrop-blur-[2px] animate-fade-in"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Modal */}
        <div
          ref={(node) => {
            (modalRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
            if (typeof ref === 'function') ref(node);
            else if (ref) ref.current = node;
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'modal-title' : undefined}
          aria-describedby={description ? 'modal-description' : undefined}
          className={`
            relative z-10 w-full overflow-hidden
            h-[100dvh] sm:h-auto sm:max-h-[90vh]
            bg-white sm:rounded-xl shadow-elevated
            flex flex-col
            animate-scale-in
            ${sizes[size]}
            ${className}
          `}
          {...props}
        >
          {/* Header */}
          {(title || description) && (
            <div className="flex items-start justify-between gap-4 p-5 border-b border-gray-100">
              <div className="flex-1 min-w-0">
                {title && (
                  <h2 id="modal-title" className="text-base font-semibold text-gray-900">
                    {title}
                  </h2>
                )}
                {description && (
                  <p id="modal-description" className="text-sm text-gray-500 mt-1">
                    {description}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-1.5 -me-1.5 -mt-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Fermer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Close button if no header */}
          {!title && !description && (
            <button
              onClick={onClose}
              className="absolute top-3 end-3 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors z-10"
              aria-label="Fermer"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-5">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="p-5 pt-4 border-t border-gray-100 bg-gray-50/50">
              {footer}
            </div>
          )}
        </div>
      </div>,
      document.body
    );
  }
);

Modal.displayName = 'Modal';
