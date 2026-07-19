-- Migration: Track Hyp/Yaad Shrig payment status on orders
-- Date: 2026-07-19
-- Description: Formalize the payment_* columns used by app/api/payment/callback (previously
-- applied directly to production outside version control) and add a CHECK constraint on
-- payment_status so the DB matches the app's PaymentStatus type.

-- ============================================
-- 1. ORDERS TABLE - Payment columns (no-op if already present from prior drift)
-- ============================================

ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_transaction_id TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_auth_code TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_card_mask TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_card_brand TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_error_code TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_error_message TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_updated_at TIMESTAMPTZ;

-- Enforce the same set of values as the app's PaymentStatus type
-- (types/order.types.ts). Drop first so this migration can be re-run safely.
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_payment_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_payment_status_check
  CHECK (payment_status IS NULL OR payment_status IN (
    'pending', 'approved', 'declined', 'error', 'amount_mismatch', 'verification_pending'
  ));

-- Index for the admin order list / alerting on non-approved payments
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
