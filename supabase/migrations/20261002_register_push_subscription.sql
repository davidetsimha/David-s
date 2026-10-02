-- ============================================
-- Register a push subscription for the current admin.
--
-- A browser endpoint is unique. If it was first registered under another admin
-- account, a client-side upsert is rejected by RLS (the existing row belongs to
-- someone else) and the device silently stops receiving notifications.
-- This function takes over the endpoint for the calling user.
-- ============================================

CREATE OR REPLACE FUNCTION register_push_subscription(
  p_endpoint TEXT,
  p_p256dh TEXT,
  p_auth TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  INSERT INTO push_subscriptions (user_id, endpoint, p256dh, auth)
  VALUES (auth.uid(), p_endpoint, p_p256dh, p_auth)
  ON CONFLICT (endpoint) DO UPDATE
    SET user_id = EXCLUDED.user_id,
        p256dh = EXCLUDED.p256dh,
        auth = EXCLUDED.auth;
END;
$$;

REVOKE ALL ON FUNCTION register_push_subscription(TEXT, TEXT, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION register_push_subscription(TEXT, TEXT, TEXT) TO authenticated;
