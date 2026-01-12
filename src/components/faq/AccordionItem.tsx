import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

interface AccordionItemProps {
  question: string;
  answer: string;
  defaultOpen?: boolean;
}

export function AccordionItem({ question, answer, defaultOpen = false }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gold-200/50 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          w-full flex items-center justify-between gap-4
          py-5 px-1 text-start
          focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-inset
          group
        "
        aria-expanded={isOpen}
      >
        <span className="
          font-display text-lg md:text-xl text-gold-800
          group-hover:text-gold-600 transition-colors
        ">
          {question}
        </span>
        <span className={`
          flex-shrink-0 w-8 h-8 rounded-full
          flex items-center justify-center
          transition-all duration-200
          ${isOpen
            ? 'bg-gold-500 text-white rotate-180'
            : 'bg-cream-200 text-gold-600 group-hover:bg-gold-100'
          }
        `}>
          {isOpen ? <Minus size={18} /> : <Plus size={18} />}
        </span>
      </button>

      <div className={`
        overflow-hidden transition-all duration-300 ease-out
        ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
      `}>
        <div className="pb-5 px-1 text-gold-700/80 leading-relaxed">
          {answer}
        </div>
      </div>
    </div>
  );
}
