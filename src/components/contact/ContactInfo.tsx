import { MapPin, Phone, Mail, Clock } from 'lucide-react';

interface ContactInfoItem {
  icon: typeof MapPin;
  label: string;
  value: string;
  href?: string;
}

const contactItems: ContactInfoItem[] = [
  {
    icon: MapPin,
    label: 'כתובת',
    value: 'רחוב הזהב 42, תל אביב',
    href: 'https://maps.google.com/?q=רחוב+הזהב+42+תל+אביב',
  },
  {
    icon: Phone,
    label: 'טלפון',
    value: '03-1234567',
    href: 'tel:031234567',
  },
  {
    icon: Mail,
    label: 'אימייל',
    value: 'info@davids-patisserie.co.il',
    href: 'mailto:info@davids-patisserie.co.il',
  },
  {
    icon: Clock,
    label: 'שעות פעילות',
    value: 'א\'-ה\' 07:00-19:00 | שישי 07:00-14:00',
  },
];

export function ContactInfo() {
  return (
    <div className="space-y-6">
      {contactItems.map((item) => {
        const Icon = item.icon;
        const content = (
          <div className="flex items-start gap-4 group">
            <div className="
              flex-shrink-0 w-12 h-12 rounded-xl
              bg-gold-100 flex items-center justify-center
              group-hover:bg-gold-200 transition-colors
            ">
              <Icon className="w-5 h-5 text-gold-600" />
            </div>
            <div>
              <p className="text-sm text-gold-500 mb-1">{item.label}</p>
              <p className="text-gold-800 font-medium">{item.value}</p>
            </div>
          </div>
        );

        if (item.href) {
          return (
            <a
              key={item.label}
              href={item.href}
              target={item.href.startsWith('http') ? '_blank' : undefined}
              rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="block hover:opacity-80 transition-opacity"
            >
              {content}
            </a>
          );
        }

        return <div key={item.label}>{content}</div>;
      })}
    </div>
  );
}
