-- Migration: Advanced Order System for David's Patisserie
-- Date: 2025-01-15
-- Description: Add product types, order confirmation workflow, delivery zones, and push notifications

-- ============================================
-- 1. PRODUCTS TABLE - New columns
-- ============================================

-- Product type: 'individual' for individual cakes, 'plateau' for platters/large cakes
ALTER TABLE products ADD COLUMN IF NOT EXISTS product_type TEXT DEFAULT 'individual';
ALTER TABLE products ADD CONSTRAINT products_product_type_check
  CHECK (product_type IN ('individual', 'plateau'));

-- Whether admin confirmation is required before order is processed
ALTER TABLE products ADD COLUMN IF NOT EXISTS requires_confirmation BOOLEAN DEFAULT false;

-- Minimum days in advance for ordering (0 = same day allowed)
ALTER TABLE products ADD COLUMN IF NOT EXISTS min_days_advance INTEGER DEFAULT 0;

-- ============================================
-- 2. ORDERS TABLE - New columns
-- ============================================

-- Pickup/delivery date chosen by customer
ALTER TABLE orders ADD COLUMN IF NOT EXISTS pickup_date DATE;

-- Time slot for pickup: '8h30-13h30' for Friday, '10h-20h' for weekdays
ALTER TABLE orders ADD COLUMN IF NOT EXISTS pickup_time_slot TEXT;

-- Order type derived from cart contents
ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_type TEXT DEFAULT 'individual';
ALTER TABLE orders ADD CONSTRAINT orders_order_type_check
  CHECK (order_type IN ('individual', 'plateau'));

-- Confirmation status for plateau orders
ALTER TABLE orders ADD COLUMN IF NOT EXISTS confirmation_status TEXT DEFAULT 'not_required';
ALTER TABLE orders ADD CONSTRAINT orders_confirmation_status_check
  CHECK (confirmation_status IN ('not_required', 'pending_confirmation', 'confirmed', 'rejected'));

-- Admin notes (reason for rejection, special instructions, etc.)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS admin_notes TEXT;

-- Payment link generated after admin confirmation (for plateau orders)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_link TEXT;

-- Flag for late orders (e.g., Thursday night for Shabbat)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS is_late_order BOOLEAN DEFAULT false;

-- Delivery zone reference
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_zone_id UUID;

-- ============================================
-- 3. DELIVERY ZONES TABLE - New table
-- ============================================

CREATE TABLE IF NOT EXISTS delivery_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_fr TEXT NOT NULL,
  name_he TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  sort_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign key constraint to orders
ALTER TABLE orders ADD CONSTRAINT orders_delivery_zone_fk
  FOREIGN KEY (delivery_zone_id) REFERENCES delivery_zones(id) ON DELETE SET NULL;

-- ============================================
-- 4. PUSH SUBSCRIPTIONS TABLE - For PWA notifications
-- ============================================

CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_id ON push_subscriptions(user_id);

-- ============================================
-- 5. SPECIAL DATES TABLE - For Jewish holidays
-- ============================================

CREATE TABLE IF NOT EXISTS special_dates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL UNIQUE,
  name_fr TEXT NOT NULL,
  name_he TEXT NOT NULL,
  is_pickup_day BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 6. RLS POLICIES
-- ============================================

-- Delivery zones: public read, admin write
ALTER TABLE delivery_zones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "delivery_zones_public_read" ON delivery_zones
  FOR SELECT USING (true);

CREATE POLICY "delivery_zones_admin_write" ON delivery_zones
  FOR ALL USING (auth.role() = 'authenticated');

-- Push subscriptions: users can manage their own
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "push_subscriptions_user_manage" ON push_subscriptions
  FOR ALL USING (auth.uid() = user_id);

-- Special dates: public read, admin write
ALTER TABLE special_dates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "special_dates_public_read" ON special_dates
  FOR SELECT USING (true);

CREATE POLICY "special_dates_admin_write" ON special_dates
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================
-- 7. SAMPLE DELIVERY ZONES (Jerusalem)
-- ============================================

INSERT INTO delivery_zones (name_fr, name_he, price, sort_order) VALUES
  ('Centre-ville', 'מרכז העיר', 40.00, 1),
  ('Rehavia', 'רחביה', 40.00, 2),
  ('Talpiot', 'תלפיות', 50.00, 3),
  ('Baka', 'בקעה', 45.00, 4),
  ('Katamon', 'קטמון', 45.00, 5),
  ('Givat Shaul', 'גבעת שאול', 55.00, 6),
  ('Ramot', 'רמות', 60.00, 7),
  ('Pisgat Zeev', 'פסגת זאב', 65.00, 8),
  ('Neve Yaakov', 'נווה יעקב', 70.00, 9)
ON CONFLICT DO NOTHING;
