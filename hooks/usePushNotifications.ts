import { useState, useEffect, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/config/queryClient';
import {
  isPushSupported,
  getNotificationPermission,
  subscribeToPush,
  unsubscribeFromPush,
  savePushSubscription,
  isPushSubscriptionSaved,
  isSubscriptionForKey,
} from '@/services/push.service';

// VAPID public key - should be set in environment variables
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';

export interface UsePushNotificationsReturn {
  isSupported: boolean;
  permission: NotificationPermission;
  isSubscribed: boolean;
  isLoading: boolean;
  error: Error | null;
  subscribe: () => Promise<void>;
  unsubscribe: () => Promise<void>;
}

export function usePushNotifications(): UsePushNotificationsReturn {
  const [isSupported] = useState(() => isPushSupported());
  const [permission, setPermission] = useState<NotificationPermission>(() =>
    getNotificationPermission()
  );
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  const queryClient = useQueryClient();

  // Initialize service worker and check subscription status
  useEffect(() => {
    if (!isSupported) {
      setIsLoading(false);
      return;
    }

    async function init() {
      try {
        const reg = await navigator.serviceWorker.ready;
        setRegistration(reg);

        let subscription = await reg.pushManager.getSubscription();
        const granted = getNotificationPermission() === 'granted';

        // Subscription created with an old VAPID key: the push service would reject it.
        if (subscription && VAPID_PUBLIC_KEY && !isSubscriptionForKey(subscription, VAPID_PUBLIC_KEY)) {
          await unsubscribeFromPush(reg);
          subscription = null;
          if (granted) {
            await subscribeToPush(reg, VAPID_PUBLIC_KEY);
            subscription = await reg.pushManager.getSubscription();
          }
        }

        // The browser is subscribed but the database row is missing (expired and
        // cleaned up by send-push, or never saved): re-register it so this device
        // actually receives notifications.
        if (subscription && granted && !(await isPushSubscriptionSaved(subscription.endpoint))) {
          await savePushSubscription(subscription);
        }

        setIsSubscribed(!!subscription);
        setPermission(getNotificationPermission());
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to initialize push notifications'));
      } finally {
        setIsLoading(false);
      }
    }

    init();
  }, [isSupported]);

  // Subscribe mutation
  const subscribeMutation = useMutation({
    mutationFn: async () => {
      if (!registration) throw new Error('Service worker not ready');
      if (!VAPID_PUBLIC_KEY) throw new Error('VAPID public key not configured');
      return subscribeToPush(registration, VAPID_PUBLIC_KEY);
    },
    onSuccess: () => {
      setIsSubscribed(getNotificationPermission() === 'granted');
      setPermission(getNotificationPermission());
      queryClient.invalidateQueries({ queryKey: queryKeys.pushSubscriptions.all });
    },
    onError: (err) => {
      setError(err instanceof Error ? err : new Error('Failed to subscribe'));
    },
  });

  // Unsubscribe mutation
  const unsubscribeMutation = useMutation({
    mutationFn: async () => {
      if (!registration) throw new Error('Service worker not ready');
      return unsubscribeFromPush(registration);
    },
    onSuccess: () => {
      setIsSubscribed(false);
      queryClient.invalidateQueries({ queryKey: queryKeys.pushSubscriptions.all });
    },
    onError: (err) => {
      setError(err instanceof Error ? err : new Error('Failed to unsubscribe'));
    },
  });

  const subscribe = useCallback(async () => {
    setError(null);
    await subscribeMutation.mutateAsync();
  }, [subscribeMutation]);

  const unsubscribe = useCallback(async () => {
    setError(null);
    await unsubscribeMutation.mutateAsync();
  }, [unsubscribeMutation]);

  return {
    isSupported,
    permission,
    isSubscribed,
    isLoading: isLoading || subscribeMutation.isPending || unsubscribeMutation.isPending,
    error,
    subscribe,
    unsubscribe,
  };
}
