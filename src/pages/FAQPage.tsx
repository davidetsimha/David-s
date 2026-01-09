import { Accordion } from '../components/faq';
import type { FAQItem } from '../components/faq';

const faqItems: FAQItem[] = [
  {
    id: '1',
    question: 'מה רמת הכשרות של המאפים?',
    answer: 'כל המוצרים שלנו מיוצרים תחת השגחת הרבנות הראשית ומחזיקים בתעודת כשרות מהודרת. אנו מקפידים על הפרדה מלאה בין חלבי לפרווה.',
  },
  {
    id: '2',
    question: 'האם יש אפשרות למשלוחים?',
    answer: 'כן! אנו מבצעים משלוחים בכל אזור גוש דן והמרכז. משלוחים עד 5 ק"מ מהחנות ללא עלות, מעבר לכך תוספת דמי משלוח. ניתן גם לאסוף מהחנות.',
  },
  {
    id: '3',
    question: 'כמה זמן מראש צריך להזמין?',
    answer: 'להזמנות רגילות - לפחות 48 שעות מראש. לעוגות מיוחדות וקבלות פנים - לפחות שבוע מראש. בתקופות עמוסות כמו חגים, מומלץ להזמין מוקדם יותר.',
  },
  {
    id: '4',
    question: 'האם ניתן להזמין עוגות בהתאמה אישית?',
    answer: 'בהחלט! אנו מתמחים בעוגות מעוצבות לאירועים - ימי הולדת, חתונות, בר/בת מצווה ועוד. צרו איתנו קשר לתיאום פגישת ייעוץ והצגת עיצובים.',
  },
  {
    id: '5',
    question: 'מהם שעות הפעילות של החנות?',
    answer: 'החנות פתוחה בימים א\'-ה\' בשעות 07:00-19:00, בימי שישי 07:00-14:00. בערבי חג וחגים - נא להתעדכן בעמוד הראשי או ליצור קשר.',
  },
  {
    id: '6',
    question: 'האם יש אופציות ללא גלוטן או טבעוניות?',
    answer: 'יש לנו מבחר מוצרים ללא גלוטן ומספר אופציות טבעוניות. מומלץ ליצור קשר מראש כדי לוודא זמינות או להזמין מראש מוצרים ספציפיים.',
  },
];

export function FAQPage() {
  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-b from-cream-100 to-cream-50">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-gold-700 mb-4">
            שאלות נפוצות
          </h1>
          <p className="text-gold-600/80 text-lg max-w-xl mx-auto">
            תשובות לשאלות הנפוצות ביותר שלנו
          </p>
          <div className="mt-8 w-24 h-0.5 bg-gold-400 mx-auto" />
        </div>
      </section>

      {/* FAQ Content */}
      <section className="container mx-auto px-4 py-12 max-w-3xl">
        <Accordion items={faqItems} defaultOpenIndex={0} />

        {/* Contact CTA */}
        <div className="mt-12 text-center p-8 bg-cream-100 rounded-2xl border border-gold-200/50">
          <p className="text-gold-700 mb-2">לא מצאתם תשובה לשאלה שלכם?</p>
          <a
            href="/contact"
            className="
              inline-flex items-center gap-2
              text-gold-600 font-medium hover:text-gold-700
              underline underline-offset-4 decoration-gold-300
              hover:decoration-gold-500 transition-colors
            "
          >
            צרו איתנו קשר
          </a>
        </div>
      </section>
    </div>
  );
}
