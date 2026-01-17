-- Migration: Add Event Formulas Table
-- Date: 2026-01-17
-- Description: Create event_formulas table for managing event package formulas from admin

-- ============================================
-- 1. CREATE EVENT FORMULAS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS event_formulas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_fr TEXT NOT NULL,
  name_he TEXT NOT NULL,
  tagline_fr TEXT NOT NULL,
  tagline_he TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  min_guests INTEGER NOT NULL DEFAULT 80,
  time_slot TEXT NOT NULL CHECK (time_slot IN ('morning', 'afternoon')),
  includes_fr JSONB NOT NULL DEFAULT '[]'::jsonb,
  includes_he JSONB NOT NULL DEFAULT '[]'::jsonb,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. ROW LEVEL SECURITY
-- ============================================

ALTER TABLE event_formulas ENABLE ROW LEVEL SECURITY;

-- Public can read formulas
CREATE POLICY "event_formulas_public_read" ON event_formulas
  FOR SELECT USING (true);

-- Only authenticated users (admin) can update
CREATE POLICY "event_formulas_admin_update" ON event_formulas
  FOR UPDATE USING (auth.role() = 'authenticated');

-- ============================================
-- 3. INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_event_formulas_time_slot ON event_formulas(time_slot);
CREATE INDEX IF NOT EXISTS idx_event_formulas_sort_order ON event_formulas(sort_order);

-- ============================================
-- 4. SEED DATA - 6 FORMULAS (3 morning + 3 afternoon)
-- ============================================

INSERT INTO event_formulas (name_fr, name_he, tagline_fr, tagline_he, price, min_guests, time_slot, includes_fr, includes_he, image_url, sort_order)
VALUES
  -- Morning Formulas
  (
    'Formule 1',
    'פורמולה 1',
    'Petit-déjeuner sucré-salé complet',
    'ארוחת בוקר מלאה מתוקה-מלוחה',
    150.00,
    80,
    'morning',
    '["Petit four sucré", "Bouchée salée", "Fromage/baguette", "Salade", "Viennoiserie", "Stand crêpes", "Stand omelette", "Saumon fumé", "Décoration florale"]'::jsonb,
    '["מאפה מתוק", "ביס מלוח", "גבינות/באגט", "סלט", "מאפי בוקר", "עמדת קרפים", "עמדת חביתות", "סלמון מעושן", "עיצוב פרחוני"]'::jsonb,
    '/images/gallery/petits-fours-1.jpg',
    1
  ),
  (
    'Formule 2',
    'פורמולה 2',
    'Formule complète avec stands chauds',
    'פורמולה מלאה עם עמדות חמות',
    180.00,
    80,
    'morning',
    '["Tout de Formule 1", "2 salades fraîches en plus", "Stand pâtes", "Stand pizza"]'::jsonb,
    '["הכל מפורמולה 1", "2 סלטים טריים נוספים", "עמדת פסטה", "עמדת פיצה"]'::jsonb,
    '/images/creations/buffet-traiteur.jpg',
    2
  ),
  (
    'Formule 3',
    'פורמולה 3',
    'Formule prestige avec vaisselle en verre',
    'פורמולה יוקרתית עם כלי זכוכית',
    200.00,
    80,
    'morning',
    '["Tout de Formule 2", "Stand moufletta/sfenj", "Grands gâteaux (Mille feuille/fraisier selon saison)", "Vaisselle en verre"]'::jsonb,
    '["הכל מפורמולה 2", "עמדת מופלטה/ספינג׳", "עוגות גדולות (מילפיי/תות לפי עונה)", "כלי זכוכית"]'::jsonb,
    '/images/creations/pieces-montees-event.jpg',
    3
  ),
  -- Afternoon Formulas
  (
    'Formule 1',
    'פורמולה 1',
    'Buffet festif sucré-salé',
    'בופה חגיגי מתוק-מלוח',
    180.00,
    80,
    'afternoon',
    '["Bouchée salée", "Salade fraîche", "Poisson fumé", "Stand pâtes", "Gratin/lasagne", "Fromage/baguette", "Buffet dessert (petit four/stand crêpe)", "Décoration florale"]'::jsonb,
    '["ביס מלוח", "סלט טרי", "דג מעושן", "עמדת פסטה", "גרטן/לזניה", "גבינות/באגט", "בופה קינוחים (מאפים/עמדת קרפים)", "עיצוב פרחוני"]'::jsonb,
    '/images/creations/eclairs-creme.jpg',
    4
  ),
  (
    'Formule 2',
    'פורמולה 2',
    'Formule enrichie avec desserts premium',
    'פורמולה מורחבת עם קינוחי פרימיום',
    220.00,
    80,
    'afternoon',
    '["Tout de Formule 1", "Stand panini", "2 salades fraîches en plus", "Dessert crème brûlée / mousse chocolat"]'::jsonb,
    '["הכל מפורמולה 1", "עמדת פניני", "2 סלטים טריים נוספים", "קינוח קרם ברולה / מוס שוקולד"]'::jsonb,
    '/images/creations/buffet-traiteur.jpg',
    5
  ),
  (
    'Formule 3',
    'פורמולה 3',
    'Notre formule la plus complète avec vaisselle en verre',
    'הפורמולה המקיפה ביותר שלנו עם כלי זכוכית',
    250.00,
    80,
    'afternoon',
    '["Tout de Formule 2", "Stand pizza", "Vaisselle en verre"]'::jsonb,
    '["הכל מפורמולה 2", "עמדת פיצה", "כלי זכוכית"]'::jsonb,
    '/images/creations/pieces-montees-event.jpg',
    6
  )
ON CONFLICT DO NOTHING;
