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

  const subscriptionJson = subscription.toJSON();
  const keys = subscriptionJson.keys as unknown as PushSubscriptionKeys;
  if (!keys || !keys.p256dh || !keys.auth) {
    throw new Error('Invalid subscription keys');
  }

  // Save to database
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('User not authenticated');

  const subscriptionData: CreatePushSubscriptionDTO = {
    endpoint: subscription.endpoint,
    p256dh: keys.p256dh,
    auth: keys.auth,
  };

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
