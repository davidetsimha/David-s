import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageCircle } from 'lucide-react';

type TimeSlot = 'morning' | 'afternoon';

interface Formula {
  id: string;
  nameFr: string;
  nameHe: string;
  price: number;
  minGuests: number;
  taglineFr: string;
  taglineHe: string;
  includesFr: string[];
  includesHe: string[];
  image: string;
}

const morningFormulas: Formula[] = [
  {
    id: 'matinale',
    nameFr: 'La Matinale',
    nameHe: 'ארוחת הבוקר',
    price: 150,
    minGuests: 30,
    taglineFr: 'Petit-déjeuner sucré-salé complet',
    taglineHe: 'ארוחת בוקר מלאה מתוקה-מלוחה',
    includesFr: [
      'Petits fours sucrés variés',
      'Viennoiseries fraîches',
      'Bouchées salées',
      'Plateaux fromages & saumon',
      'Stand crêpes',
      'Boissons'
    ],
    includesHe: [
      'מבחר מאפים מתוקים',
      'מאפי בוקר טריים',
      'ביס מלוח',
      'מגשי גבינות וסלמון',
      'עמדת קרפים',
      'משקאות'
    ],
    image: '/images/gallery/petits-fours-1.jpg'
  },
  {
    id: 'prestige',
    nameFr: 'La Prestige',
    nameHe: 'הפרסטיז׳',
    price: 200,
    minGuests: 50,
    taglineFr: 'Formule haut de gamme avec animations',
    taglineHe: 'פורמולה יוקרתית עם הנפשות',
    includesFr: [
      'Tout de La Matinale',
      'Stand pizza artisanale',
      'Grands gâteaux',
      'Stand sfenj/moufletta',
      'Décoration florale',
      'Service premium'
    ],
    includesHe: [
      'הכל מארוחת הבוקר',
      'עמדת פיצה',
      'עוגות גדולות',
      'עמדת ספינג׳/מופלטה',
      'עיצוב פרחוני',
      'שירות פרימיום'
    ],
    image: '/images/creations/buffet-traiteur.jpg'
  }
];

const afternoonFormulas: Formula[] = [
  {
    id: 'apres-midi',
    nameFr: "L'Après-Midi",
    nameHe: 'אחר הצהריים',
    price: 180,
    minGuests: 30,
    taglineFr: 'Buffet festif sucré-salé',
    taglineHe: 'בופה חגיגי מתוק-מלוח',
    includesFr: [
      'Petits fours premium',
      'Bouchées salées variées',
      'Plateaux fromages & saumon',
      'Stand crêpes',
      'Stand panini & pâtes',
      'Boissons'
    ],
    includesHe: [
      'מאפים מתוקים פרימיום',
      'מבחר ביס מלוח',
      'מגשי גבינות וסלמון',
      'עמדת קרפים',
      'עמדת פניני ופסטה',
      'משקאות'
    ],
    image: '/images/creations/eclairs-creme.jpg'
  },
  {
    id: 'exception',
    nameFr: "L'Exception",
    nameHe: 'היוצא מן הכלל',
    price: 250,
    minGuests: 50,
    taglineFr: 'Notre formule la plus complète',
    taglineHe: 'הפורמולה המקיפה ביותר שלנו',
    includesFr: [
      "Tout de L'Après-Midi",
      'Stand pizza artisanale',
      'Sushi mix premium',
      'Pièce montée',
      'Verrines & crèmes brûlées',
      'Stand sfenj/moufletta'
    ],
    includesHe: [
      'הכל מאחר הצהריים',
      'עמדת פיצה',
      'סושי מיקס פרימיום',
      'מגדל קרופמבוש',
      'ורינים וקרם ברולה',
      'עמדת ספינג׳/מופלטה'
    ],
    image: '/images/creations/pieces-montees-event.jpg'
  }
];

export function FormulasSection() {
  const { t, i18n } = useTranslation();
  const isHebrew = i18n.language === 'he';
  const [activeSlot, setActiveSlot] = useState<TimeSlot>('morning');

  const formulas = activeSlot === 'morning' ? morningFormulas : afternoonFormulas;

  const whatsappNumber = '972587819457';
  const getWhatsappLink = (formula: Formula) => {
    const formulaName = isHebrew ? formula.nameHe : formula.nameFr;
    const message = encodeURIComponent(
      t('formulas.whatsappMessage', { formula: formulaName })
    );
    return `https://wa.me/${whatsappNumber}?text=${message}`;
  };

  return (
    <section className="py-20 bg-cream-50">
      {/* Header */}
      <div className="max-w-5xl mx-auto px-4 text-center mb-12">
        <p className="text-gold-600 text-sm tracking-[0.3em] uppercase mb-3">
          {t('formulas.title')}
        </p>
        <h2 className="font-display text-4xl md:text-5xl text-stone-800 mb-4">
          {t('formulas.subtitle')}
        </h2>
        <p className="text-stone-500 max-w-lg mx-auto">
          {t('formulas.description')}
        </p>
      </div>

      {/* Time Toggle */}
      <div className="flex justify-center mb-16">
        <div className="inline-flex border-b border-stone-200">
          <button
            onClick={() => setActiveSlot('morning')}
            className={`px-8 py-3 text-sm tracking-widest uppercase transition-all duration-300 relative
              ${activeSlot === 'morning'
                ? 'text-gold-600'
                : 'text-stone-400 hover:text-stone-600'}`}
          >
            {t('formulas.morning')}
            {activeSlot === 'morning' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-500" />
            )}
          </button>
          <button
            onClick={() => setActiveSlot('afternoon')}
            className={`px-8 py-3 text-sm tracking-widest uppercase transition-all duration-300 relative
              ${activeSlot === 'afternoon'
                ? 'text-gold-600'
                : 'text-stone-400 hover:text-stone-600'}`}
          >
            {t('formulas.afternoon')}
            {activeSlot === 'afternoon' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-500" />
            )}
          </button>
        </div>
      </div>

      {/* Formulas Grid */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8">
          {formulas.map((formula, index) => (
            <article
              key={formula.id}
              className="group bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-500"
            >
              {/* Image */}
              <div className="relative h-72 overflow-hidden">
                <img
                  src={formula.image}
                  alt={isHebrew ? formula.nameHe : formula.nameFr}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                {/* Price overlay */}
                <div className="absolute bottom-4 start-4">
                  <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-sm">
                    <span className="text-2xl font-light text-stone-800">{formula.price}</span>
                    <span className="text-stone-500 text-sm ms-1">₪ / {isHebrew ? 'אדם' : 'pers'}</span>
                  </div>
                </div>

                {/* Index badge */}
                <div className="absolute top-4 end-4">
                  <span className="text-white/80 text-xs tracking-widest">
                    0{index + 1}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="font-display text-2xl text-stone-800 mb-1">
                    {isHebrew ? formula.nameHe : formula.nameFr}
                  </h3>
                  <p className="text-gold-600 text-sm">
                    {isHebrew ? formula.taglineHe : formula.taglineFr}
                  </p>
                </div>

                <p className="text-stone-400 text-xs uppercase tracking-wider mb-3">
                  {t('formulas.minGuests', { count: formula.minGuests })}
                </p>

                {/* Includes list */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mb-6">
                  {(isHebrew ? formula.includesHe : formula.includesFr).map((item, i) => (
                    <p key={i} className="text-stone-600 text-sm flex items-center gap-2">
                      <span className="w-1 h-1 bg-gold-400 rounded-full shrink-0" />
                      {item}
                    </p>
                  ))}
                </div>

                {/* CTA */}
                <a
                  href={getWhatsappLink(formula)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-stone-600 hover:text-gold-600
                    text-sm tracking-wide transition-colors group/link"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{t('formulas.cta')}</span>
                  <span className="transition-transform group-hover/link:translate-x-1">→</span>
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* Footer note */}
        <p className="text-center text-stone-400 text-sm mt-12">
          * {t('formulas.note')}
        </p>
      </div>
    </section>
  );
}
