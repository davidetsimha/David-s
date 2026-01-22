import { useState, useRef, useEffect, type ReactNode } from 'react';
import { MoreHorizontal, type LucideIcon } from 'lucide-react';

interface DropdownItem {
  label: string;
  icon?: LucideIcon;
  onClick: () => void;
  variant?: 'default' | 'danger';
  disabled?: boolean;
}

interface DropdownSeparator {
  type: 'separator';
}

type DropdownMenuItemType = DropdownItem | DropdownSeparator;

interface DropdownMenuProps {
  items: DropdownMenuItemType[];
  trigger?: ReactNode;
  align?: 'start' | 'end';
}

export function DropdownMenu({ items, trigger, align = 'end' }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) &&
          triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleItemClick = (item: DropdownItem) => {
    if (!item.disabled) {
      item.onClick();
      setIsOpen(false);
    }
  };

  return (
    <div className="relative inline-block">
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100
          transition-colors focus-visible:ring-2 focus-visible:ring-gold-500
          focus-visible:ring-offset-2 focus-visible:outline-none"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {trigger || <MoreHorizontal className="w-4 h-4" />}
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          className={`
            absolute z-50 mt-1 min-w-[160px] py-1
            bg-white rounded-lg border border-gray-100 shadow-dropdown
            animate-slide-down
            ${align === 'end' ? 'end-0' : 'start-0'}
          `}
          role="menu"
        >
          {items.map((item, index) => {
            if ('type' in item && item.type === 'separator') {
              return <div key={index} className="my-1 border-t border-gray-100" role="separator" />;
            }

            const menuItem = item as DropdownItem;
            const Icon = menuItem.icon;
            const isDanger = menuItem.variant === 'danger';

            return (
              <button
                key={index}
                onClick={() => handleItemClick(menuItem)}
                disabled={menuItem.disabled}
                className={`
                  w-full flex items-center gap-2.5 px-3 py-2 text-sm text-start
                  transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                  ${isDanger
                    ? 'text-red-600 hover:bg-red-50'
                    : 'text-gray-700 hover:bg-gray-50'
                  }
                `}
                role="menuitem"
              >
                {Icon && <Icon className="w-4 h-4 shrink-0" />}
                <span>{menuItem.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
