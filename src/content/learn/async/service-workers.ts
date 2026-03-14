import type { LessonContent } from '@/types/content';

export const serviceWorkersLesson: LessonContent = {
  id: 'service-workers-001',
  title: 'Service Workers: Progressive Web Apps',
  description: 'Master Service Workers for building offline-capable, performant Progressive Web Applications with caching and background sync.',
  slug: 'learn/async/service-workers',
  pillar: 'learn',
  category: 'async',
  tags: ['service-workers', 'pwa', 'offline', 'caching', 'background-sync', 'network'],
  difficulty: 'advanced',
  contentType: 'lesson',
  summary: 'Learn to build Progressive Web Apps with Service Workers. Understand lifecycle, caching strategies, offline functionality, and background synchronization.',
  relatedTopics: ['web-workers', 'promises', 'async-await'],
  order: 7,
  updatedAt: '2024-01-15T12:45:00Z',
  readingTime: 24,
  featured: true,
  keywords: ['Service Worker', 'PWA', 'Progressive Web App', 'offline', 'cache', 'background sync', 'push notification'],
  prerequisites: ['promises', 'async-await', 'fetch-api'],
  learningGoals: [
    'Understand Service Worker lifecycle and registration',
    'Master cache strategies for offline functionality',
    'Implement network-first and cache-first patterns',
    'Learn background synchronization',
    'Build offline-capable Progressive Web Apps',
    'Handle Service Worker updates and versions'
  ],
  sections: [
    {
      type: 'heading',
      level: 2,
      text: 'What are Service Workers?',
      id: 'what-are-service-workers'
    },
    {
      type: 'paragraph',
      text: 'Service Workers are specialized Web Workers that act as a proxy between your web application and the network. They enable offline functionality, caching, background synchronization, and push notifications. Service Workers persist beyond the lifetime of a page and can intercept network requests.'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Registering a Service Worker
// main.js
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(registration => {
      console.log('Service Worker registered:', registration);
    })
    .catch(error => {
      console.error('Service Worker registration failed:', error);
    });
}

// service-worker.js
// Service Worker runs in background
console.log('Service Worker installed');

// Service Workers require HTTPS in production (HTTP ok for localhost)
// They are automatically updated when the script changes`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Service Worker Lifecycle',
      id: 'service-worker-lifecycle'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Service Worker lifecycle events

// 1. Install - happens once when first registered
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');

  // Pre-cache assets during install
  event.waitUntil(
    caches.open('v1').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/styles.css',
        '/script.js',
        '/offline.html'
      ]);
    })
  );
});

// 2. Activate - happens after install, when old worker replaced
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');

  // Clean up old caches
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== 'v1') {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );

  // Claim existing clients
  return self.clients.claim();
});

// 3. Fetch - intercept network requests
self.addEventListener('fetch', (event) => {
  console.log('Fetch intercepted:', event.request.url);

  // Handle differently based on strategy
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached response if available
      return response || fetch(event.request);
    })
  );
});

// Lifecycle visualization:
// First visit: Install -> Activate -> Fetch
// Update: Install (new version) -> Wait -> Activate -> Fetch
// Unregistered: (removed from memory)`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Caching Strategies',
      id: 'caching-strategies'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Strategy 1: Cache First (Offline First)
// Use cache, fall back to network if miss
const cacheFirstStrategy = (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response; // Found in cache
        }

        return fetch(event.request).then((response) => {
          // Cache successful responses
          if (!response || response.status !== 200) {
            return response;
          }

          const responseToCache = response.clone();
          caches.open('v1').then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        });
      })
      .catch(() => {
        // Offline fallback
        return caches.match('/offline.html');
      })
  );
};

// Strategy 2: Network First
// Try network first, fall back to cache
const networkFirstStrategy = (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful responses
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open('v1').then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Network failed, use cache
        return caches.match(event.request);
      })
  );
};

// Strategy 3: Stale While Revalidate
// Return cache immediately, update in background
const staleWhileRevalidateStrategy = (event) => {
  event.respondWith(
    caches.open('v1').then((cache) => {
      return cache.match(event.request).then((response) => {
        // Return cached response immediately
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          // Update cache with fresh response
          if (networkResponse && networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        });

        return response || fetchPromise;
      });
    })
  );
};

// Strategy 4: Cache Only
// Only serve from cache (for immutable assets)
const cacheOnlyStrategy = (event) => {
  event.respondWith(
    caches.match(event.request)
  );
};

// Strategy 5: Network Only
// Always fetch from network
const networkOnlyStrategy = (event) => {
  event.respondWith(fetch(event.request));
};

// Applying strategies by request type
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // HTML - network first
  if (event.request.mode === 'navigate') {
    event.respondWith(networkFirstStrategy(event));
    return;
  }

  // CSS/JS - cache first (versioned)
  if (url.pathname.match(/\\.(js|css)$/)) {
    event.respondWith(cacheFirstStrategy(event));
    return;
  }

  // Images - cache first with stale-while-revalidate
  if (url.pathname.match(/\\.(png|jpg|jpeg|gif|svg)$/)) {
    event.respondWith(staleWhileRevalidateStrategy(event));
    return;
  }

  // API calls - network first
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirstStrategy(event));
    return;
  }

  // Default - network first
  event.respondWith(networkFirstStrategy(event));
});`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Offline Functionality',
      id: 'offline-functionality'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Service Worker - handling offline
const CACHE_NAME = 'app-v1';
const OFFLINE_PAGE = '/offline.html';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/offline.html',
        '/styles.css',
        '/script.js',
        '/images/logo.png'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  // Navigation requests (HTML pages)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match(event.request)
            .then((response) => {
              return response || caches.match(OFFLINE_PAGE);
            });
        })
    );
    return;
  }

  // Non-navigation requests
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
      .catch(() => {
        // Return placeholder for failed requests
        if (event.request.destination === 'image') {
          return new Response(
            '<svg width="200" height="200"><rect fill="#ddd" width="200" height="200"/></svg>',
            { headers: { 'Content-Type': 'image/svg+xml' } }
          );
        }
      })
  );
});

// Main app - handling offline mode
window.addEventListener('offline', () => {
  console.log('App went offline');
  showOfflineBanner();
});

window.addEventListener('online', () => {
  console.log('App back online');
  hideOfflineBanner();
  syncPendingData();
});

function showOfflineBanner() {
  const banner = document.createElement('div');
  banner.id = 'offline-banner';
  banner.textContent = 'You are offline. Some features may be unavailable.';
  banner.style.cssText = 'background: #ff6b6b; color: white; padding: 10px; text-align: center;';
  document.body.insertBefore(banner, document.body.firstChild);
}

function hideOfflineBanner() {
  const banner = document.getElementById('offline-banner');
  if (banner) banner.remove();
}`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Background Synchronization',
      id: 'background-sync'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Background Sync API for offline actions
// Main application
async function submitFormOfflineCapable(formData) {
  try {
    // Try to send immediately
    const response = await fetch('/api/submit', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.ok) {
      console.log('Form submitted successfully');
      return response.json();
    }
  } catch (error) {
    console.log('Network error, queuing for background sync');

    // Store data for later
    const db = await openDatabase();
    await db.add('pending-requests', {
      url: '/api/submit',
      method: 'POST',
      body: formData,
      timestamp: Date.now()
    });

    // Request background sync
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      try {
        const registration = await navigator.serviceWorker.ready;
        await registration.sync.register('sync-pending-requests');
        console.log('Background sync registered');
      } catch (syncError) {
        console.error('Background sync failed:', syncError);
      }
    }
  }
}

// Service Worker - handling background sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-pending-requests') {
    event.waitUntil(syncPendingRequests());
  }
});

async function syncPendingRequests() {
  try {
    const db = await openDatabase();
    const requests = await db.getAll('pending-requests');

    for (const request of requests) {
      try {
        const response = await fetch(request.url, {
          method: request.method,
          body: JSON.stringify(request.body),
          headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
          // Remove from pending
          await db.delete('pending-requests', request.id);
          console.log('Synced:', request.url);
        }
      } catch (error) {
        console.error('Sync failed for:', request.url, error);
        // Will retry on next sync event
      }
    }
  } catch (error) {
    console.error('Background sync error:', error);
    throw error; // Retry sync
  }
}

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('AppDB', 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('pending-requests')) {
        db.createObjectStore('pending-requests', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Service Worker Updates',
      id: 'service-worker-updates'
    },
    {
      type: 'code',
      language: 'javascript',
      code: `// Handling Service Worker updates
navigator.serviceWorker.ready.then((registration) => {
  // Check for updates periodically
  setInterval(() => {
    registration.update();
  }, 60000); // Check every minute
});

navigator.serviceWorker.addEventListener('controllerchange', () => {
  console.log('New Service Worker took control');
  // Refresh page to load new assets
  window.location.reload();
});

// Listen for updates in background
navigator.serviceWorker.addEventListener('message', (event) => {
  if (event.data.type === 'SW_UPDATE_AVAILABLE') {
    console.log('Service Worker update available');
    showUpdatePrompt();
  }
});

function showUpdatePrompt() {
  const message = document.createElement('div');
  message.style.cssText = 'position: fixed; bottom: 20px; right: 20px; background: blue; color: white; padding: 20px; border-radius: 5px; cursor: pointer; z-index: 9999;';
  message.textContent = 'Update available - Click to refresh';

  message.onclick = () => {
    window.location.reload();
  };

  document.body.appendChild(message);
}

// Service Worker - notifying about updates
self.addEventListener('activate', (event) => {
  event.waitUntil(
    self.clients.matchAll().then((clients) => {
      clients.forEach((client) => {
        client.postMessage({
          type: 'SW_UPDATE_AVAILABLE'
        });
      });
    })
  );
});

// Versioned cache names for clean updates
const CACHE_VERSION = 1;
const CACHE_NAME = `app-cache-v\${CACHE_VERSION}`;

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => !name.includes(`v\${CACHE_VERSION}`))
          .map((name) => {
            console.log('Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    })
  );
});`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Summary',
      id: 'summary'
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Key Takeaways',
      text: 'Service Workers act as a proxy between your app and the network. They enable offline functionality, caching, and background synchronization. Lifecycle: install → activate → fetch events. Common strategies: cache-first, network-first, stale-while-revalidate. Use Service Workers to build Progressive Web Apps that work offline. Update caching strategy by versioning cache names. Background Sync API syncs pending requests when connection returns.'
    }
  ],
  exercises: [
    'Register a Service Worker and implement basic caching',
    'Implement a cache-first strategy for static assets',
    'Build an offline page and serve it when network fails',
    'Implement background sync for pending form submissions',
    'Create a versioned cache system for clean updates',
    'Build a complete offline-capable TODO app with Service Worker'
  ]
};
