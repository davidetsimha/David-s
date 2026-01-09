import { AccordionItem } from './AccordionItem';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface AccordionProps {
  items: FAQItem[];
  defaultOpenIndex?: number;
}

export function Accordion({ items, defaultOpenIndex }: AccordionProps) {
  return (
    <div className="
      bg-white rounded-2xl shadow-sm
      border border-gold-100
      divide-y divide-gold-100
      px-6 md:px-8
    ">
      {items.map((item, index) => (
        <AccordionItem
          key={item.id}
          question={item.question}
          answer={item.answer}
          defaultOpen={index === defaultOpenIndex}
        />
      ))}
    </div>
  );
}

export type { FAQItem };
