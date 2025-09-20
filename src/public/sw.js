const CACHE_NAME = 'thefmsmkt-v1.0.0';
const STATIC_CACHE = 'thefmsmkt-static-v1.0.0';
const DYNAMIC_CACHE = 'thefmsmkt-dynamic-v1.0.0';

// Resources to cache immediately
const STATIC_RESOURCES = [
  '/',
  '/styles/globals.css',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap',
  'https://fonts.googleapis.com/icon?family=Material+Icons'
];

// Install event - cache static resources
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Install');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[ServiceWorker] Caching static resources');
        return cache.addAll(STATIC_RESOURCES);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activate');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              return cacheName !== STATIC_CACHE && 
                     cacheName !== DYNAMIC_CACHE &&
                     cacheName.startsWith('thefmsmkt-');
            })
            .map((cacheName) => {
              console.log('[ServiceWorker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension requests
  if (url.protocol === 'chrome-extension:') {
    return;
  }

  // Different strategies for different types of requests
  if (isStaticResource(request)) {
    // Cache First strategy for static resources
    event.respondWith(cacheFirst(request));
  } else if (isAPIRequest(request)) {
    // Network First strategy for API requests
    event.respondWith(networkFirst(request));
  } else if (isImageRequest(request)) {
    // Cache First strategy for images
    event.respondWith(cacheFirst(request));
  } else {
    // Stale While Revalidate for everything else
    event.respondWith(staleWhileRevalidate(request));
  }
});

// Cache First strategy
async function cacheFirst(request) {
  try {
    const cache = await caches.open(STATIC_CACHE);
    const cached = await cache.match(request);
    
    if (cached) {
      return cached;
    }
    
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.error('[ServiceWorker] Cache First failed:', error);
    
    // Return offline fallback if available
    const cache = await caches.open(STATIC_CACHE);
    return cache.match('/offline.html') || new Response('Offline');
  }
}

// Network First strategy
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.error('[ServiceWorker] Network First failed:', error);
    
    const cache = await caches.open(DYNAMIC_CACHE);
    const cached = await cache.match(request);
    
    if (cached) {
      return cached;
    }
    
    // Return custom offline response for API calls
    return new Response(
      JSON.stringify({
        error: 'Offline',
        message: 'This request requires an internet connection'
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Stale While Revalidate strategy
async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cached = await cache.match(request);
  
  const networkPromise = fetch(request).then((response) => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => cached);
  
  return cached || networkPromise;
}

// Helper functions
function isStaticResource(request) {
  const url = new URL(request.url);
  return STATIC_RESOURCES.some(resource => url.pathname.endsWith(resource)) ||
         url.pathname.includes('/assets/') ||
         url.pathname.endsWith('.css') ||
         url.pathname.endsWith('.js') ||
         url.hostname === 'fonts.googleapis.com' ||
         url.hostname === 'fonts.gstatic.com';
}

function isAPIRequest(request) {
  const url = new URL(request.url);
  return url.pathname.includes('/api/') || 
         url.pathname.includes('/functions/') ||
         url.hostname.includes('supabase.co');
}

function isImageRequest(request) {
  const url = new URL(request.url);
  return url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg|ico)$/i) ||
         url.hostname.includes('unsplash.com') ||
         url.hostname.includes('images.unsplash.com');
}

// Background sync for offline orders
self.addEventListener('sync', (event) => {
  if (event.tag === 'order-sync') {
    event.waitUntil(syncOfflineOrders());
  }
});

async function syncOfflineOrders() {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    const pendingOrders = await cache.match('/pending-orders');
    
    if (pendingOrders) {
      const orders = await pendingOrders.json();
      
      for (const order of orders) {
        try {
          await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(order)
          });
          
          // Remove from pending after successful sync
          await cache.delete('/pending-orders');
        } catch (error) {
          console.error('[ServiceWorker] Failed to sync order:', error);
        }
      }
    }
  } catch (error) {
    console.error('[ServiceWorker] Background sync failed:', error);
  }
}

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('[ServiceWorker] Push received');
  
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (error) {
    console.error('[ServiceWorker] Error parsing push data:', error);
  }
  
  const options = {
    title: data.title || 'THEFMSMKT Update',
    body: data.body || 'You have a new notification',
    icon: '/icon-192x192.png',
    badge: '/icon-96x96.png',
    image: data.image,
    data: data.data || {},
    actions: [
      {
        action: 'view',
        title: 'View Order',
        icon: '/icon-96x96.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ],
    requireInteraction: true,
    vibrate: [200, 100, 200],
    tag: data.tag || 'general'
  };
  
  event.waitUntil(
    self.registration.showNotification(options.title, options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('[ServiceWorker] Notification clicked');
  
  event.notification.close();
  
  if (event.action === 'view') {
    const urlToOpen = event.notification.data.url || '/';
    
    event.waitUntil(
      clients.matchAll({ type: 'window' })
        .then((clientList) => {
          for (let client of clientList) {
            if (client.url === urlToOpen && 'focus' in client) {
              return client.focus();
            }
          }
          
          if (clients.openWindow) {
            return clients.openWindow(urlToOpen);
          }
        })
    );
  }
});

// Handle offline order storage
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'STORE_OFFLINE_ORDER') {
    storeOfflineOrder(event.data.order);
  }
});

async function storeOfflineOrder(order) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    const existingOrders = await cache.match('/pending-orders');
    
    let orders = [];
    if (existingOrders) {
      orders = await existingOrders.json();
    }
    
    orders.push({
      ...order,
      timestamp: Date.now(),
      offline: true
    });
    
    await cache.put('/pending-orders', new Response(JSON.stringify(orders)));
    
    // Register background sync
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      await self.registration.sync.register('order-sync');
    }
  } catch (error) {
    console.error('[ServiceWorker] Failed to store offline order:', error);
  }
}