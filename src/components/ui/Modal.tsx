import { type HTMLAttributes, forwardRef, useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onClose: () => void;
  title?: string;
}

export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  ({ open, onClose, title, className = '', children, ...props }, ref) => {
    useEffect(() => {
      if (open) {
        document.body.style.overflow = 'hidden';
        const handleEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
        window.addEventListener('keydown', handleEsc);
        return () => {
          document.body.style.overflow = '';
          window.removeEventListener('keydown', handleEsc);
        };
      }
    }, [open, onClose]);

    if (!open) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm animate-fade-in"
          onClick={onClose}
          aria-hidden="true"
        />
        <div
          ref={ref}
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
          <div className="sticky top-0 flex items-center justify-between p-6 pb-4 bg-white border-b border-gray-100">
            {title && (
              <h2 id="modal-title" className="font-display text-xl text-gray-900">
                {title}
              </h2>
            )}
            <button
              onClick={onClose}
              className="ms-auto p-2 -me-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
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
