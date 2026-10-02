import { supabase } from './supabase';

export interface PushSubscription {
  id: string;
  user_id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  created_at: string;
}

export interface PushSubscriptionKeys {
  p256dh: string;
  auth: string;
}

export interface CreatePushSubscriptionDTO {
  endpoint: string;
  p256dh: string;
  auth: string;
}

// Check if browser supports push notifications
export function isPushSupported(): boolean {
  return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
}

// Request notification permission
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isPushSupported()) {
    throw new Error('Push notifications are not supported in this browser');
  }
  return Notification.requestPermission();
}

// Get current notification permission status
export function getNotificationPermission(): NotificationPermission {
  if (!isPushSupported()) return 'denied';
  return Notification.permission;
}

// Subscribe to push notifications
export async function subscribeToPush(
  registration: ServiceWorkerRegistration,
  vapidPublicKey: string
): Promise<PushSubscription | null> {
  const permission = await requestNotificationPermission();
  if (permission !== 'granted') {
    return null;
  }

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(vapidPublicKey) as BufferSource,
  });

  return savePushSubscription(subscription);
}

// Save a browser subscription to the database for the current admin.
// Uses the register_push_subscription RPC, which also takes over an endpoint
// previously registered under another admin account (a plain upsert would be
// rejected by RLS in that case). Falls back to the upsert if the RPC isn't deployed.
export async function savePushSubscription(
  subscription: globalThis.PushSubscription
): Promise<PushSubscription | null> {
  const subscriptionJson = subscription.toJSON();
  const keys = subscriptionJson.keys as unknown as PushSubscriptionKeys;
  if (!keys || !keys.p256dh || !keys.auth) {
    throw new Error('Invalid subscription keys');
  }

  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('User not authenticated');

  const subscriptionData: CreatePushSubscriptionDTO = {
    endpoint: subscription.endpoint,
    p256dh: keys.p256dh,
    auth: keys.auth,
  };

  const { error: rpcError } = await supabase.rpc('register_push_subscription', {
    p_endpoint: subscriptionData.endpoint,
    p_p256dh: subscriptionData.p256dh,
    p_auth: subscriptionData.auth,
  });

  if (!rpcError) return null;
  // PGRST202 = function not found (migration not applied yet)
  if (rpcError.code !== 'PGRST202') throw rpcError;

  const { data, error } = await supabase
    .from('push_subscriptions')
    .upsert(
      { ...subscriptionData, user_id: user.user.id },
      { onConflict: 'endpoint' }
    )
    .select('*')
    .single();

  if (error) throw error;
  return data as PushSubscription;
}

// Check that the browser subscription is actually stored in the database
// (rows can be removed by the send-push function when an endpoint expires).
export async function isPushSubscriptionSaved(endpoint: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('push_subscriptions')
    .select('id')
    .eq('endpoint', endpoint)
    .limit(1);

  if (error) throw error;
  return !!data && data.length > 0;
}

// Unsubscribe from push notifications
export async function unsubscribeFromPush(
  registration: ServiceWorkerRegistration
): Promise<boolean> {
  const subscription = await registration.pushManager.getSubscription();
  if (!subscription) return true;

  // Remove from database
  const { error } = await supabase
    .from('push_subscriptions')
    .delete()
    .eq('endpoint', subscription.endpoint);

  if (error) throw error;

  // Unsubscribe from browser
  return subscription.unsubscribe();
}

// Get current push subscription
export async function getCurrentPushSubscription(
  registration: ServiceWorkerRegistration
): Promise<PushSubscriptionJSON | null> {
  const subscription = await registration.pushManager.getSubscription();
  return subscription?.toJSON() || null;
}

// Get all admin push subscriptions (for sending notifications)
export async function getAllAdminPushSubscriptions(): Promise<PushSubscription[]> {
  const { data, error } = await supabase.from('push_subscriptions').select('*');

  if (error) throw error;
  return data as PushSubscription[];
}

// Check whether a browser subscription was created with the given VAPID public key.
// After a VAPID key rotation, old subscriptions are rejected by the push service (403).
export function isSubscriptionForKey(
  subscription: globalThis.PushSubscription,
  vapidPublicKey: string
): boolean {
  const current = subscription.options?.applicationServerKey;
  if (!current) return true; // Unknown (older browsers): assume it matches
  const expected = urlBase64ToUint8Array(vapidPublicKey);
  const actual = new Uint8Array(current);
  return actual.length === expected.length && actual.every((b, i) => b === expected[i]);
}

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
