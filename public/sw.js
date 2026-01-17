// David's Patisserie Service Worker
// Handles push notifications and basic offline caching

const CACHE_NAME = 'davids-admin-v1';
const OFFLINE_URL = '/admin';

// Assets to cache for offline support
const PRECACHE_ASSETS = [
  '/admin',
  '/manifest.json',
];

// Install event - cache essential assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  // Activate immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  // Take control of all pages immediately
  self.clients.claim();
});

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', (event) => {
  // Only handle same-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Skip API calls and Supabase requests
  if (event.request.url.includes('/api/') ||
      event.request.url.includes('supabase')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone the response to cache it
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // Return cached version if network fails
        return caches.match(event.request).then((cachedResponse) => {
          return cachedResponse || caches.match(OFFLINE_URL);
        });
      })
  );
});

// Push notification event
self.addEventListener('push', (event) => {
  if (!event.data) {
    console.log('Push event with no data');
    return;
  }

  try {
    const data = event.data.json();

    const options = {
      body: data.body || 'Nouvelle notification',
      icon: data.icon || '/icons/icon-192x192.png',
      badge: data.badge || '/icons/icon-72x72.png',
      vibrate: [100, 50, 100],
      data: {
        url: data.url || '/admin/orders',
        orderId: data.orderId,
        dateOfArrival: Date.now(),
      },
      actions: data.actions || [
        { action: 'view', title: 'Voir la commande' },
        { action: 'dismiss', title: 'Ignorer' },
      ],
      tag: data.tag || 'order-notification',
      renotify: true,
      requireInteraction: data.requireInteraction !== false,
    };

    event.waitUntil(
      self.registration.showNotification(
        data.title || "David's Patisserie",
        options
      )
    );
  } catch (error) {
    console.error('Error parsing push notification:', error);

    // Fallback for plain text notifications
    event.waitUntil(
      self.registration.showNotification("David's Patisserie", {
        body: event.data.text(),
        icon: '/icons/icon-192x192.png',
      })
    );
  }
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/admin/orders';

  if (event.action === 'dismiss') {
    return;
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Check if there's already a window open with the admin panel
      for (const client of windowClients) {
        if (client.url.includes('/admin') && 'focus' in client) {
          // Navigate the existing window to the order
          client.navigate(urlToOpen);
          return client.focus();
        }
      }
      // Open a new window if none found
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Background sync for offline order updates (future feature)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-orders') {
    event.waitUntil(syncOrders());
  }
});

async function syncOrders() {
  // Placeholder for future offline sync functionality
  console.log('Syncing orders...');
}
