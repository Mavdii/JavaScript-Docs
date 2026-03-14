import type { IntegrationContent } from '@/types/content';

export const pushNotificationsIntegration: IntegrationContent = {
  id: 'integration-push-notifications',
  title: 'Push Notifications',
  description: 'Send real-time push notifications to users via the Web Push API, even when your app is closed.',
  slug: 'integrations/push-notifications',
  pillar: 'integrations',
  category: 'browser',
  tags: ['push notifications', 'service worker', 'web push', 'notifications', 'vapid'],
  difficulty: 'intermediate',
  contentType: 'integration',
  summary: 'Master Web Push Notifications — requesting user permission, Service Worker setup, sending notifications, handling interactions, and VAPID key generation.',
  relatedTopics: ['integration-rest-apis'],
  order: 1,
  updatedAt: '2025-06-01',
  readingTime: 22,
  featured: true,
  keywords: ['Push notifications', 'Service Worker', 'Web Push', 'VAPID', 'Notifications API'],
  requiredLibraries: ['web-push (server)', 'service-worker (client)'],
  setupSteps: ['Generate VAPID keys', 'Register Service Worker', 'Request permission', 'Subscribe to push', 'Send notifications from server'],
  authNotes: 'Store VAPID private key securely on server. Never expose it. Use HTTPS only.',
  sections: [
    {
      type: 'heading',
      level: 2,
      text: 'Requesting Notification Permission',
      id: 'request-permission',
    },
    {
      type: 'paragraph',
      text: 'Before you can send notifications, the user must grant permission. This requires user interaction and is site-specific.',
    },
    {
      type: 'code',
      language: 'typescript',
      code: `async function requestNotificationPermission(): Promise<NotificationPermission> {
  // Check if browser supports notifications
  if (!('Notification' in window)) {
    console.log('Browser does not support notifications');
    return 'denied';
  }

  // Check current permission
  if (Notification.permission !== 'default') {
    return Notification.permission; // Already asked
  }

  // Request permission
  const permission = await Notification.requestPermission();

  if (permission === 'granted') {
    console.log('Notification permission granted');
    // Show a test notification
    new Notification('Notifications Enabled!', {
      body: 'You will now receive notifications from this site.',
      icon: '/logo.png',
      badge: '/badge.png',
    });
  } else if (permission === 'denied') {
    console.log('User denied notification permission');
  }

  return permission;
}

// Call on user action (not on page load)
document.getElementById('enable-notifications')?.addEventListener('click', () => {
  requestNotificationPermission();
});

// Check permission status
function getNotificationStatus(): {
  supported: boolean;
  permission: NotificationPermission;
  enabled: boolean;
} {
  const supported = 'Notification' in window;
  const permission = supported ? Notification.permission : 'denied';
  const enabled = permission === 'granted' && 'serviceWorker' in navigator;

  return { supported, permission, enabled };
}`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Service Worker Registration & Setup',
      id: 'service-worker',
    },
    {
      type: 'paragraph',
      text: 'Service Workers run in the background and can receive push events even when the app is closed. Register it early in your app lifecycle.',
    },
    {
      type: 'code',
      language: 'typescript',
      code: `// In your main app file
async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) {
    console.log('Browser does not support service workers');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register(
      '/sw.js',
      { scope: '/' }
    );

    console.log('Service Worker registered:', registration.scope);

    // Check for updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      newWorker?.addEventListener('statechange', () => {
        if (newWorker.state === 'activated') {
          console.log('New Service Worker activated');
          // Notify user to refresh (optional)
        }
      });
    });

    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    return null;
  }
}

// Call on app startup
registerServiceWorker();

// Unregister (for testing)
async function unregisterServiceWorker(): Promise<void> {
  const registrations = await navigator.serviceWorker.getRegistrations();
  for (const registration of registrations) {
    await registration.unregister();
  }
}`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Subscribing to Push Notifications',
      id: 'subscribe',
    },
    {
      type: 'paragraph',
      text: 'Subscribing gets a unique endpoint and encryption keys. Send this subscription to your server to store it for sending notifications.',
    },
    {
      type: 'code',
      language: 'typescript',
      code: `interface PushSubscriptionJSON {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

async function subscribeToPush(
  registration: ServiceWorkerRegistration,
  vapidPublicKey: string
): Promise<PushSubscriptionJSON | null> {
  try {
    // Check if already subscribed
    const existing = await registration.pushManager.getSubscription();
    if (existing) {
      console.log('Already subscribed');
      return existing.toJSON();
    }

    // Subscribe to push
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
    });

    console.log('Subscribed to push notifications');

    // Send subscription to server
    await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscription.toJSON()),
    });

    return subscription.toJSON();
  } catch (error) {
    console.error('Failed to subscribe to push:', error);
    return null;
  }
}

// Helper to convert VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

// Get current subscription
async function getCurrentSubscription(
  registration: ServiceWorkerRegistration
): Promise<PushSubscriptionJSON | null> {
  const subscription = await registration.pushManager.getSubscription();
  return subscription?.toJSON() || null;
}

// Unsubscribe
async function unsubscribeFromPush(
  registration: ServiceWorkerRegistration
): Promise<boolean> {
  const subscription = await registration.pushManager.getSubscription();
  if (subscription) {
    await subscription.unsubscribe();
    console.log('Unsubscribed from push');
    return true;
  }
  return false;
}`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Service Worker Push Event Handler',
      id: 'push-event',
    },
    {
      type: 'paragraph',
      text: 'The Service Worker receives push events and displays notifications. This code runs in the background even when the app is closed.',
    },
    {
      type: 'code',
      language: 'typescript',
      code: `// In sw.js (Service Worker file)
self.addEventListener('push', (event: PushEvent) => {
  console.log('Push notification received');

  if (!event.data) {
    console.log('Push event has no data');
    return;
  }

  let notificationData;

  try {
    notificationData = event.data.json();
  } catch {
    notificationData = {
      title: 'New Notification',
      body: event.data.text(),
    };
  }

  const {
    title = 'Notification',
    body = '',
    icon = '/icon.png',
    badge = '/badge.png',
    tag = 'default',
    data = {},
  } = notificationData;

  const options: NotificationOptions = {
    body,
    icon,
    badge,
    tag, // Replaces previous notifications with same tag
    data, // Custom data passed to click/close handlers
    requireInteraction: false, // Auto-dismiss after timeout
    actions: [
      {
        action: 'open',
        title: 'Open',
      },
      {
        action: 'close',
        title: 'Close',
      },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Handle notification click
self.addEventListener('notificationclick', (event: NotificationEvent) => {
  event.notification.close();

  const data = event.notification.data;
  const action = event.action;

  console.log('Notification clicked:', action, data);

  if (action === 'close') {
    return;
  }

  // Open or focus window
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // Try to find existing window
      for (const client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return (client as WindowClient).focus();
        }
      }

      // Open new window
      if (clients.openWindow) {
        return clients.openWindow(data?.url || '/');
      }
    })
  );
});

// Handle notification close
self.addEventListener('notificationclose', (event: NotificationEvent) => {
  console.log('Notification closed');
});`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Server-side Push Sending',
      id: 'server-push',
    },
    {
      type: 'paragraph',
      text: 'From your backend, use the Web Push protocol to send encrypted messages to subscribed clients. You need VAPID keys to sign requests.',
    },
    {
      type: 'code',
      language: 'typescript',
      code: `import webpush from 'web-push';

// Set VAPID details (do once at startup)
webpush.setVapidDetails(
  'mailto:admin@example.com',
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

// Send notification to specific user
async function sendNotification(
  subscription: PushSubscription,
  payload: any
): Promise<void> {
  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify(payload)
    );
    console.log('Notification sent');
  } catch (error: any) {
    if (error.statusCode === 410) {
      // Subscription no longer valid
      console.log('Subscription expired, remove from database');
    } else {
      console.error('Failed to send notification:', error);
    }
  }
}

// Send to multiple users
async function broadcastNotification(
  subscriptions: PushSubscription[],
  payload: any
): Promise<void> {
  const promises = subscriptions.map(sub =>
    sendNotification(sub, payload).catch(console.error)
  );

  await Promise.all(promises);
}

// Example: Send notification on new post
app.post('/api/posts', authenticateUser, async (req, res) => {
  const { title, content } = req.body;
  const userId = req.user.id;

  // Create post
  const post = await db.posts.create({
    title,
    content,
    authorId: userId,
  });

  // Get all followers' subscriptions
  const followers = await db.getUserFollowers(userId);
  const subscriptions = await db.getUserSubscriptions(followers.map(f => f.id));

  // Send notifications
  const payload = {
    title: \`\${req.user.name} posted\`,
    body: title,
    icon: req.user.photoURL,
    data: {
      url: \`/posts/\${post.id}\`,
      postId: post.id,
    },
  };

  await broadcastNotification(subscriptions, payload);

  res.json(post);
});

// Store subscription in database
app.post('/api/subscribe', authenticateUser, async (req, res) => {
  const subscription = req.body;
  const userId = req.user.id;

  // Check if already exists
  const existing = await db.subscriptions.findOne({
    userId,
    endpoint: subscription.endpoint,
  });

  if (!existing) {
    await db.subscriptions.create({
      userId,
      ...subscription,
      createdAt: new Date(),
    });
  }

  res.json({ success: true });
});`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Generating VAPID Keys',
      id: 'vapid-keys',
    },
    {
      type: 'paragraph',
      text: 'VAPID (Voluntary Application Server Identification) keys authenticate your server to the push service. Generate them once and store securely.',
    },
    {
      type: 'code',
      language: 'bash',
      code: `# Generate VAPID keys (run once)
npx web-push generate-vapid-keys

# Output:
# Public Key: <long-base64-string>
# Private Key: <long-base64-string>

# Store in .env:
# VAPID_PUBLIC_KEY=<public-key>
# VAPID_PRIVATE_KEY=<private-key>

# Programmatically:
npm install web-push

# JavaScript
const webpush = require('web-push');
const vapidKeys = webpush.generateVAPIDKeys();
console.log('Public:', vapidKeys.publicKey);
console.log('Private:', vapidKeys.privateKey);`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Best Practices & Error Handling',
      id: 'best-practices',
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'HTTPS Required',
      text: 'Service Workers and Push API require HTTPS (except localhost). Unencrypted HTTP won\'t work.',
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Handle Expired Subscriptions',
      text: 'Subscriptions can expire or be revoked by users. If you get a 410 status, delete that subscription from your database.',
    },
    {
      type: 'code',
      language: 'typescript',
      code: `// Graceful degradation
class NotificationManager {
  private registration: ServiceWorkerRegistration | null = null;

  async initialize(vapidPublicKey: string): Promise<boolean> {
    // Check support
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.log('Push notifications not supported');
      return false;
    }

    try {
      this.registration = await navigator.serviceWorker.register('/sw.js');
      return true;
    } catch (error) {
      console.error('Failed to register Service Worker:', error);
      return false;
    }
  }

  async subscribe(vapidPublicKey: string): Promise<boolean> {
    if (!this.registration) return false;

    const permission = await requestNotificationPermission();
    if (permission !== 'granted') {
      console.log('Notification permission not granted');
      return false;
    }

    try {
      const subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      });

      await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription.toJSON()),
      });

      return true;
    } catch (error) {
      console.error('Subscription failed:', error);
      return false;
    }
  }

  async isSubscribed(): Promise<boolean> {
    if (!this.registration) return false;

    const subscription = await this.registration.pushManager.getSubscription();
    return subscription !== null;
  }

  async unsubscribe(): Promise<boolean> {
    if (!this.registration) return false;

    const subscription = await this.registration.pushManager.getSubscription();
    if (subscription) {
      await subscription.unsubscribe();
      return true;
    }

    return false;
  }
}

// Usage
const notificationManager = new NotificationManager();

// Initialize on app load
await notificationManager.initialize(process.env.REACT_APP_VAPID_PUBLIC_KEY!);

// Subscribe on user action
document.getElementById('subscribe-btn')?.addEventListener('click', async () => {
  const success = await notificationManager.subscribe(
    process.env.REACT_APP_VAPID_PUBLIC_KEY!
  );

  if (success) {
    console.log('Subscribed to notifications');
  } else {
    console.log('Failed to subscribe');
  }
});`,
    },
    {
      type: 'table',
      headers: ['Scenario', 'Approach', 'Example'],
      rows: [
        ['Welcome user', 'Send immediately after subscription', 'Thank you for subscribing!'],
        ['Real-time updates', 'Send on server event', 'New comment on your post'],
        ['Scheduled', 'Use cron job on server', 'Daily digest at 9 AM'],
        ['Multiple actions', 'Use notification.actions', 'Open / Archive / Reply'],
      ],
    },
  ],
};
