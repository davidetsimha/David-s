import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Store, Truck, MapPin } from 'lucide-react';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';

export type DeliveryMethod = 'pickup' | 'delivery';

export interface DeliveryAddress {
  street: string;
  city: string;
  postalCode: string;
}

interface DeliveryOptionsProps {
  value: DeliveryMethod;
  onChange: (method: DeliveryMethod) => void;
  address: DeliveryAddress;
  onAddressChange: (address: DeliveryAddress) => void;
}

export function DeliveryOptions({ value, onChange, address, onAddressChange }: DeliveryOptionsProps) {
  const { t, i18n } = useTranslation();
  const direction = i18n.dir();
  const [notes, setNotes] = useState('');

  return (
    <div className="space-y-4" dir={direction}>
      <h3 className="font-display text-lg text-stone-800 mb-4">
        {t('checkout.deliveryMethod')}
      </h3>
      <div className="grid gap-3">
        <OptionCard value="pickup" selected={value === 'pickup'} onChange={onChange}
          icon={Store} title={t('checkout.pickup')}
          subtitle={t('checkout.pickupSubtitle')} />
        <OptionCard value="delivery" selected={value === 'delivery'} onChange={onChange}
          icon={Truck} title={t('checkout.delivery')}
          subtitle={t('checkout.deliverySubtitle')} />
      </div>
      {value === 'delivery' && (
        <div className="space-y-4 pt-2 animate-fade-in">
          {/* Street address */}
          <div className="relative">
            <MapPin className="absolute top-9 text-stone-400 w-5 h-5 start-3 pointer-events-none" />
            <Input
              label={t('checkout.address')}
              placeholder={t('checkout.address')}
              value={address.street}
              onChange={(e) => onAddressChange({ ...address, street: e.target.value })}
              className="ps-11"
              required
            />
          </div>
          {/* City and postal code in a row */}
          <div className="grid grid-cols-2 gap-3">
            <Input
              label={t('checkout.city')}
              placeholder={t('checkout.city')}
              value={address.city}
              onChange={(e) => onAddressChange({ ...address, city: e.target.value })}
              required
            />
            <Input
              label={t('checkout.postalCode')}
              placeholder={t('checkout.postalCode')}
              value={address.postalCode}
              onChange={(e) => onAddressChange({ ...address, postalCode: e.target.value })}
              required
            />
          </div>
          <Textarea
            placeholder={t('checkout.deliveryNotes')}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
          />
        </div>
      )}
    </div>
  );
}

interface OptionCardProps {
  value: DeliveryMethod; selected: boolean; onChange: (v: DeliveryMethod) => void;
  icon: React.ElementType; title: string; subtitle: string;
}

function OptionCard({ value, selected, onChange, icon: Icon, title, subtitle }: OptionCardProps) {
  return (
    <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
      ${selected ? 'border-gold-500 bg-gold-50/50' : 'border-stone-200 hover:border-gold-300'}`}>
      <input type="radio" name="delivery" value={value} checked={selected}
        onChange={() => onChange(value)} className="sr-only" />
      <div className={`w-10 h-10 rounded-full flex items-center justify-center
        ${selected ? 'bg-gold-500 text-white' : 'bg-cream-100 text-gold-600'}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <p className="font-medium text-stone-800">{title}</p>
        <p className="text-sm text-stone-500">{subtitle}</p>
      </div>
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
        ${selected ? 'border-gold-500' : 'border-stone-300'}`}>
        {selected && <div className="w-2.5 h-2.5 rounded-full bg-gold-500" />}
      </div>
    </label>
  );
}
