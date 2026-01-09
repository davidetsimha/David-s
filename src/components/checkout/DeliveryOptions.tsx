import { useState } from 'react';
import { Store, Truck, MapPin } from 'lucide-react';
import { useLanguageStore } from '../../stores';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';

export type DeliveryMethod = 'pickup' | 'delivery';

interface DeliveryOptionsProps {
  value: DeliveryMethod;
  onChange: (method: DeliveryMethod) => void;
  address: string;
  onAddressChange: (address: string) => void;
}

export function DeliveryOptions({ value, onChange, address, onAddressChange }: DeliveryOptionsProps) {
  const { t, direction } = useLanguageStore();
  const [notes, setNotes] = useState('');

  return (
    <div className="space-y-4" dir={direction}>
      <h3 className="font-display text-lg text-stone-800 mb-4">
        {t('Mode de livraison', 'אופן משלוח')}
      </h3>
      <div className="grid gap-3">
        <OptionCard value="pickup" selected={value === 'pickup'} onChange={onChange}
          icon={Store} title={t('Retrait en boutique', 'איסוף עצמי')}
          subtitle={t('Gratuit - Prêt sous 24h', 'חינם - מוכן תוך 24 שעות')} />
        <OptionCard value="delivery" selected={value === 'delivery'} onChange={onChange}
          icon={Truck} title={t('Livraison à domicile', 'משלוח עד הבית')}
          subtitle={t('À partir de 15 CHF', 'החל מ-15 CHF')} />
      </div>
      {value === 'delivery' && (
        <div className="space-y-3 pt-2 animate-fade-in">
          <div className="relative">
            <MapPin className="absolute top-3.5 text-stone-400 w-5 h-5 start-3 pointer-events-none" />
            <Input placeholder={t('Adresse de livraison', 'כתובת למשלוח')} value={address}
              onChange={(e) => onAddressChange(e.target.value)} className="ps-11" />
          </div>
          <Textarea placeholder={t('Instructions de livraison (optionnel)', 'הוראות משלוח (אופציונלי)')}
            value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
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
      ${selected ? 'border-gold-500 bg-gold-50/50' : 'border-gray-200 hover:border-gold-300'}`}>
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
        ${selected ? 'border-gold-500' : 'border-gray-300'}`}>
        {selected && <div className="w-2.5 h-2.5 rounded-full bg-gold-500" />}
      </div>
    </label>
  );
}
