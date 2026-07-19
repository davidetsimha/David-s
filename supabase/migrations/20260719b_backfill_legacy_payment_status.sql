-- One-time backfill: mark pre-existing individual orders as paid
-- Date: 2026-07-19
-- Description: Orders created before the payment_status tracking (app/api/payment/callback)
-- was hardened have no payment_status recorded at all, so the new admin "payment badge"
-- shows them as "Paiement en attente" even though these orders were already reviewed and
-- fulfilled by staff. This is a one-time grandfather pass: mark existing confirmed/completed
-- individual orders as paid so the new UI doesn't flag old, already-handled orders.
--
-- Scope (confirmed with the business owner):
--   - order_type = 'individual' only (plateau orders are settled via a WhatsApp payment link
--     and tracked through confirmation_status, not payment_status - leave them untouched).
--   - status IN ('confirmed', 'completed') only (orders still 'pending' or 'cancelled' are
--     left alone - they may be genuinely unpaid/abandoned, which is exactly what the new
--     payment badge is meant to surface, not hide).
--   - payment_status IS NULL only (never overwrite a real payment_status already recorded,
--     e.g. anything the webhook already touched, including declines).
--
-- This is a one-off data fix, not part of the app's ongoing logic - orders created from now
-- on get their payment_status from the (now-hardened) payment callback webhook.

UPDATE orders
SET
  payment_status = 'approved',
  payment_updated_at = COALESCE(payment_updated_at, created_at)
WHERE order_type = 'individual'
  AND status IN ('confirmed', 'completed')
  AND payment_status IS NULL;
