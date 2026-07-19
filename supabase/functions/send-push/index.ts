// Supabase Edge Function for sending push notifications
// Triggered when a new plateau order is created

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Web Push library for sending notifications
import webpush from 'https://esm.sh/web-push@3.6.6';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PushPayload {
  orderId: string;
  customerName?: string;
  totalAmount?: number;
  orderType?: string;
  pickupDate?: string;
  // Optional overrides: when provided, these are used as-is instead of the
  // "new order" title/body built from customerName/totalAmount/orderType.
  // Used for admin alerts (e.g. a payment that needs manual attention).
  title?: string;
  body?: string;
  requireInteraction?: boolean;
}

interface PushSubscription {
  id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const vapidPublicKey = Deno.env.get('VAPID_PUBLIC_KEY');
    const vapidPrivateKey = Deno.env.get('VAPID_PRIVATE_KEY');
    const vapidSubject = Deno.env.get('VAPID_SUBJECT') || 'mailto:admin@davids-patisserie.com';

    if (!vapidPublicKey || !vapidPrivateKey) {
      console.error('VAPID keys not configured');
      return new Response(
        JSON.stringify({ error: 'Push notifications not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Configure web-push
    webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);

    // Create Supabase client with service role
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request body
    const payload: PushPayload = await req.json();
    const { orderId, customerName, totalAmount, orderType, pickupDate, title, body, requireInteraction } = payload;

    // Build notification content: explicit title/body (admin alerts) take priority,
    // otherwise fall back to the "new order" content built from order fields.
    const notificationTitle = title ?? (orderType === 'plateau'
      ? 'Nouvelle commande plateau !'
      : 'Nouvelle commande');

    const notificationBody = body ?? `${customerName} - ${(totalAmount ?? 0).toFixed(2)} ILS${
      pickupDate ? ` - Retrait: ${pickupDate}` : ''
    }`;

    const notificationPayload = JSON.stringify({
      title: notificationTitle,
      body: notificationBody,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      url: `/admin/orders`,
      orderId: orderId,
      tag: `order-${orderId}`,
      requireInteraction: requireInteraction ?? orderType === 'plateau',
      actions: [
        { action: 'view', title: 'Voir' },
        { action: 'dismiss', title: 'Ignorer' },
      ],
    });

    // Get all push subscriptions
    const { data: subscriptions, error: subError } = await supabase
      .from('push_subscriptions')
      .select('*');

    if (subError) {
      console.error('Error fetching subscriptions:', subError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch subscriptions' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!subscriptions || subscriptions.length === 0) {
      console.log('No push subscriptions found');
      return new Response(
        JSON.stringify({ message: 'No subscriptions to notify' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Send notifications to all subscribed admins
    const results = await Promise.allSettled(
      subscriptions.map(async (sub: PushSubscription) => {
        const pushSubscription = {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth,
          },
        };

        try {
          await webpush.sendNotification(pushSubscription, notificationPayload);
          return { success: true, endpoint: sub.endpoint };
        } catch (error: any) {
          // If subscription is expired or invalid, remove it
          if (error.statusCode === 404 || error.statusCode === 410) {
            await supabase
              .from('push_subscriptions')
              .delete()
              .eq('endpoint', sub.endpoint);
          }
          return { success: false, endpoint: sub.endpoint, error: error.message };
        }
      })
    );

    const successCount = results.filter(
      (r) => r.status === 'fulfilled' && (r.value as any).success
    ).length;

    console.log(`Sent ${successCount}/${subscriptions.length} push notifications for order ${orderId}`);

    return new Response(
      JSON.stringify({
        success: true,
        sent: successCount,
        total: subscriptions.length,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error sending push notifications:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
