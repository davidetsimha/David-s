import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ContactInfoItem {
  icon: typeof MapPin;
  label: string;
  value: string;
  href?: string;
}

export function ContactInfo() {
  const { t } = useTranslation();

  const contactItems: ContactInfoItem[] = [
    {
      icon: MapPin,
      label: t('contact.info.address'),
      value: t('contact.info.addressValue'),
      href: 'https://maps.google.com/?q=מרכז+ספיר+6+ירושלים',
    },
    {
      icon: Phone,
      label: t('contact.info.phone'),
      value: t('contact.info.phoneValue'),
      href: 'tel:0587819457',
    },
    {
      icon: Mail,
      label: t('contact.info.email'),
      value: t('contact.info.emailValue'),
      href: 'mailto:info@davids-patisserie.co.il',
    },
    {
      icon: Clock,
      label: t('contact.info.hours'),
      value: t('contact.info.hoursValue'),
    },
  ];

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
