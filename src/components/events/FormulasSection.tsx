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
    id: 'formule-1-matin',
    nameFr: 'Formule 1',
    nameHe: 'פורמולה 1',
    price: 150,
    minGuests: 80,
    taglineFr: 'Petit-déjeuner sucré-salé complet',
    taglineHe: 'ארוחת בוקר מלאה מתוקה-מלוחה',
    includesFr: [
      'Petit four sucré',
      'Bouchée salée',
      'Fromage/baguette',
      'Salade',
      'Viennoiserie',
      'Stand crêpes',
      'Stand omelette',
      'Saumon fumé',
      'Décoration florale'
    ],
    includesHe: [
      'מאפה מתוק',
      'ביס מלוח',
      'גבינות/באגט',
      'סלט',
      'מאפי בוקר',
      'עמדת קרפים',
      'עמדת חביתות',
      'סלמון מעושן',
      'עיצוב פרחוני'
    ],
    image: '/images/gallery/petits-fours-1.jpg'
  },
  {
    id: 'formule-2-matin',
    nameFr: 'Formule 2',
    nameHe: 'פורמולה 2',
    price: 180,
    minGuests: 80,
    taglineFr: 'Formule complète avec stands chauds',
    taglineHe: 'פורמולה מלאה עם עמדות חמות',
    includesFr: [
      'Tout de Formule 1',
      '2 salades fraîches en plus',
      'Stand pâtes',
      'Stand pizza'
    ],
    includesHe: [
      'הכל מפורמולה 1',
      '2 סלטים טריים נוספים',
      'עמדת פסטה',
      'עמדת פיצה'
    ],
    image: '/images/creations/buffet-traiteur.jpg'
  },
  {
    id: 'formule-3-matin',
    nameFr: 'Formule 3',
    nameHe: 'פורמולה 3',
    price: 200,
    minGuests: 80,
    taglineFr: 'Formule prestige avec vaisselle en verre',
    taglineHe: 'פורמולה יוקרתית עם כלי זכוכית',
    includesFr: [
      'Tout de Formule 2',
      'Stand moufletta/sfenj',
      'Grands gâteaux (Mille feuille/fraisier selon saison)',
      'Vaisselle en verre'
    ],
    includesHe: [
      'הכל מפורמולה 2',
      'עמדת מופלטה/ספינג׳',
      'עוגות גדולות (מילפיי/תות לפי עונה)',
      'כלי זכוכית'
    ],
    image: '/images/creations/pieces-montees-event.jpg'
  }
];

const afternoonFormulas: Formula[] = [
  {
    id: 'formule-1-aprem',
    nameFr: 'Formule 1',
    nameHe: 'פורמולה 1',
    price: 180,
    minGuests: 80,
    taglineFr: 'Buffet festif sucré-salé',
    taglineHe: 'בופה חגיגי מתוק-מלוח',
    includesFr: [
      'Bouchée salée',
      'Salade fraîche',
      'Poisson fumé',
      'Stand pâtes',
      'Gratin/lasagne',
      'Fromage/baguette',
      'Buffet dessert (petit four/stand crêpe)',
      'Décoration florale'
    ],
    includesHe: [
      'ביס מלוח',
      'סלט טרי',
      'דג מעושן',
      'עמדת פסטה',
      'גרטן/לזניה',
      'גבינות/באגט',
      'בופה קינוחים (מאפים/עמדת קרפים)',
      'עיצוב פרחוני'
    ],
    image: '/images/creations/eclairs-creme.jpg'
  },
  {
    id: 'formule-2-aprem',
    nameFr: 'Formule 2',
    nameHe: 'פורמולה 2',
    price: 220,
    minGuests: 80,
    taglineFr: 'Formule enrichie avec desserts premium',
    taglineHe: 'פורמולה מורחבת עם קינוחי פרימיום',
    includesFr: [
      'Tout de Formule 1',
      'Stand panini',
      '2 salades fraîches en plus',
      'Dessert crème brûlée / mousse chocolat'
    ],
    includesHe: [
      'הכל מפורמולה 1',
      'עמדת פניני',
      '2 סלטים טריים נוספים',
      'קינוח קרם ברולה / מוס שוקולד'
    ],
    image: '/images/creations/buffet-traiteur.jpg'
  },
  {
    id: 'formule-3-aprem',
    nameFr: 'Formule 3',
    nameHe: 'פורמולה 3',
    price: 250,
    minGuests: 80,
    taglineFr: 'Notre formule la plus complète avec vaisselle en verre',
    taglineHe: 'הפורמולה המקיפה ביותר שלנו עם כלי זכוכית',
    includesFr: [
      'Tout de Formule 2',
      'Stand pizza',
      'Vaisselle en verre'
    ],
    includesHe: [
      'הכל מפורמולה 2',
      'עמדת פיצה',
      'כלי זכוכית'
    ],
    image: '/images/creations/pieces-montees-event.jpg'
  }
];

export function FormulasSection() {
  const { t, i18n } = useTranslation();
  const isHebrew = i18n.language === 'he';
  const [activeSlot, setActiveSlot] = useState<TimeSlot>('morning');

  const formulas = activeSlot === 'morning' ? morningFormulas : afternoonFormulas;

  const whatsappNumber = '972587495876';
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
