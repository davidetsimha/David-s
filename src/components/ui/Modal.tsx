import { type HTMLAttributes, forwardRef, useEffect, useRef, useCallback } from 'react';
import { X } from 'lucide-react';

interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onClose: () => void;
  title?: string;
}

export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  ({ open, onClose, title, className = '', children, ...props }, ref) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const previousActiveElement = useRef<HTMLElement | null>(null);

    // Focus trap handler
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

        // Focus first focusable element in modal
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
        // Return focus to previous element
        previousActiveElement.current?.focus();
      }
    }, [open, handleKeyDown]);

    if (!open) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-stone-900/50 backdrop-blur-sm animate-fade-in"
          onClick={onClose}
          aria-hidden="true"
        />
        <div
          ref={(node) => {
            // Support both internal ref and forwarded ref
            (modalRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
            if (typeof ref === 'function') ref(node);
            else if (ref) ref.current = node;
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'modal-title' : undefined}
          className={`
            relative z-10 w-full max-w-lg max-h-[90vh] overflow-auto
            bg-white rounded-2xl shadow-xl
            animate-scale-in
            ${className}
          `}
          {...props}
        >
          <div className="sticky top-0 flex items-center justify-between p-6 pb-4 bg-white border-b border-stone-100">
            {title && (
              <h2 id="modal-title" className="font-display text-xl text-stone-900">
                {title}
              </h2>
            )}
            <button
              onClick={onClose}
              className="ms-auto p-2 -me-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 focus-visible:outline-none"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="p-6">{children}</div>
        </div>
      </div>
    );
  }
);

Modal.displayName = 'Modal';
