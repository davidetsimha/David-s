-- Add "Viennoiserie" and "Hallot et autre" categories for the shabbat boutique section.
-- These are plain catalog categories: they will only appear under the "shabbat" tab
-- as long as products assigned to them use product_type = 'individual'
-- (see components/boutique/ProductSection.tsx, which only shows categories that
-- have products in the current section).

INSERT INTO categories (name_fr, name_he, slug, sort_order)
SELECT 'Viennoiserie', 'מאפים', 'viennoiserie',
  (SELECT COALESCE(MAX(sort_order), 0) FROM categories) + 1
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'viennoiserie');

INSERT INTO categories (name_fr, name_he, slug, sort_order)
SELECT 'Hallot et autre', 'חלות ועוד', 'hallot-et-autre',
  (SELECT COALESCE(MAX(sort_order), 0) FROM categories) + 1
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'hallot-et-autre');
