// Supabase Edge Function for cleaning up orphan orders
// Run via CRON job to auto-cancel pending individual orders without payment after 24h

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Cancel pending individual orders > 24h without payment
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from('orders')
      .update({
        status: 'cancelled',
        admin_notes: 'Auto-annulee: paiement non recu apres 24h',
      })
      .eq('status', 'pending')
      .eq('order_type', 'individual')
      .is('payment_transaction_id', null)
      .lt('created_at', cutoff)
      .select('id');

    if (error) {
      console.error('Error cancelling orphan orders:', error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const cancelledCount = data?.length || 0;
    console.log(`[Cleanup] Cancelled ${cancelledCount} orphan orders`);

    return new Response(
      JSON.stringify({
        success: true,
        cancelled: cancelledCount,
        orderIds: data?.map((o) => o.id) || [],
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error in cleanup function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
