import type { LessonContent } from '@/types/content';

export const notificationsLesson: LessonContent = {
  id: 'notifications',
  title: 'Notifications',
  description: 'Send desktop notifications to grab the user\'s attention from outside the browser.',
  slug: 'learn/browser/notifications',
  pillar: 'learn',
  category: 'browser',
  tags: ['notifications', 'push', 'browser', 'desktop'],
  difficulty: 'beginner',
  contentType: 'lesson',
  summary: 'The Notification API lets you send desktop notifications. Get permission from the user first, and use HTTPS.',
  relatedTopics: ['clipboard'],
  order: 9,
  updatedAt: '2024-03-01',
  readingTime: 14,
  featured: false,
  keywords: ['Notification', 'push notification', 'permission', 'desktop notification', 'Service Worker', 'badge', 'action'],
  prerequisites: ['Async/Await'],
  learningGoals: [
    'Request notification permission properly',
    'Create and customize notifications',
    'Handle notification clicks and actions',
    'Understand the difference between Notification API and Push API',
    'Use notifications with Service Workers',
    'Build a complete notification system in React',
  ],
  exercises: [
    'Build a notification system that alerts the user when a background task completes.',
    'Create a timer app that sends a notification when time is up.',
    'Implement a notification preferences panel with enable/disable.',
    'Build a notification queue that spaces out multiple notifications.',
  ],
  sections: [
    { type: 'heading', level: 2, text: 'Overview', id: 'overview' },
    { type: 'paragraph', text: 'The Notification API allows web apps to display native desktop or mobile notifications outside the browser window. Notifications appear in the system\'s notification center and work even when the user is in a different tab or app (if using Service Workers).' },
    { type: 'paragraph', text: 'The API has two parts: the simple `new Notification()` constructor for foreground notifications, and the Service Worker-based `ServiceWorkerRegistration.showNotification()` for background notifications. Both require user permission.' },

    { type: 'heading', level: 2, text: 'Requesting Permission', id: 'permission' },
    {
      type: 'code', language: 'javascript', filename: 'permission.js',
      code: `// Check current permission status
console.log(Notification.permission);
// 'default' — not asked yet
// 'granted' — permission given
// 'denied'  — permission blocked

// Request permission (returns a Promise)
async function requestNotificationPermission() {
  // Only request in response to user action (click)!
  const permission = await Notification.requestPermission();

  if (permission === 'granted') {
    console.log('Notifications enabled!');
    return true;
  } else if (permission === 'denied') {
    console.log('Notifications blocked by user');
    // Cannot request again — user must change in browser settings
    return false;
  } else {
    console.log('User dismissed the prompt');
    return false;
  }
}

// Best practice: show a custom prompt before the browser prompt
function showCustomPrompt() {
  // Show your own UI explaining why notifications are useful
  showModal({
    title: 'Stay Updated',
    body: 'Get notified when your tasks are complete.',
    onAllow: () => requestNotificationPermission(),
    onDeny: () => savePreference('notifications', false),
  });
}`,
    },
    { type: 'callout', variant: 'warning', title: 'One Chance', text: 'Once the user clicks "Block" on the browser prompt, you cannot ask again programmatically. The user must manually enable notifications in browser settings. That\'s why showing a custom prompt first is important — you can ask your custom prompt multiple times.' },

    { type: 'heading', level: 2, text: 'Creating Notifications', id: 'creating' },
    {
      type: 'code', language: 'javascript', filename: 'notification.js',
      code: `// Basic notification
const notification = new Notification('Task Complete', {
  body: 'Your file has been uploaded successfully.',
  icon: '/icon-192.png',       // Small icon
  badge: '/badge-72.png',      // Badge for mobile
  image: '/upload-preview.jpg', // Large image (Android)
  tag: 'upload-complete',       // ID to prevent duplicates
  requireInteraction: false,    // Auto-dismiss? (default: false)
  silent: false,                // Play sound? (default: false)
  data: { fileId: '123', url: '/files/123' }, // Custom data
});

// Handle click
notification.onclick = (event) => {
  event.preventDefault();  // Prevent browser from focusing tab
  window.open(notification.data.url, '_blank');
  notification.close();
};

// Handle close
notification.onclose = () => {
  console.log('Notification closed');
};

// Handle error
notification.onerror = () => {
  console.error('Notification error');
};

// Auto-close after 5 seconds
setTimeout(() => notification.close(), 5000);`,
    },

    { type: 'heading', level: 2, text: 'Notification Options', id: 'options' },
    {
      type: 'table',
      headers: ['Option', 'Type', 'Description'],
      rows: [
        ['body', 'string', 'Main notification text'],
        ['icon', 'string', 'Small icon URL (usually app icon)'],
        ['image', 'string', 'Large image preview (Android)'],
        ['badge', 'string', 'Monochrome badge icon (Android)'],
        ['tag', 'string', 'ID to group/replace notifications'],
        ['data', 'any', 'Custom data accessible in click handler'],
        ['requireInteraction', 'boolean', 'Keep visible until user interacts'],
        ['silent', 'boolean', 'Suppress sound/vibration'],
        ['renotify', 'boolean', 'Re-alert if same tag is reused'],
        ['vibrate', 'number[]', 'Vibration pattern [vibrate, pause, ...]'],
        ['dir', 'string', '"auto" | "ltr" | "rtl" text direction'],
        ['actions', 'array', 'Action buttons (Service Worker only)'],
      ],
    },

    { type: 'heading', level: 2, text: 'Tag: Preventing Duplicates', id: 'tags' },
    {
      type: 'code', language: 'javascript', filename: 'tags.js',
      code: `// Without tag: each notification creates a new one
new Notification('New message', { body: 'Message 1' });
new Notification('New message', { body: 'Message 2' });
new Notification('New message', { body: 'Message 3' });
// Shows 3 separate notifications!

// With tag: replaces the previous notification with same tag
new Notification('New message', { body: 'Message 1', tag: 'chat-notif' });
new Notification('New message', { body: 'Message 2', tag: 'chat-notif' });
new Notification('New message', { body: '3 new messages', tag: 'chat-notif' });
// Only shows the last one! (replaces previous)

// Use renotify to re-alert when replacing
new Notification('New message', {
  body: '5 new messages',
  tag: 'chat-notif',
  renotify: true, // Plays sound/vibration again
});`,
    },

    { type: 'heading', level: 2, text: 'Notification with Actions (Service Worker)', id: 'actions' },
    {
      type: 'code', language: 'javascript', filename: 'sw-notification.js',
      code: `// Actions are only available through Service Worker notifications
// Register a Service Worker first

// In your main script:
async function showActionNotification() {
  const registration = await navigator.serviceWorker.ready;

  await registration.showNotification('New Message from Alice', {
    body: 'Hey, are you coming to the meeting?',
    icon: '/icon-192.png',
    tag: 'message-alice',
    actions: [
      { action: 'reply', title: '💬 Reply', icon: '/icons/reply.png' },
      { action: 'dismiss', title: '✕ Dismiss', icon: '/icons/close.png' },
    ],
    data: { messageId: '456', from: 'alice' },
  });
}

// In service-worker.js:
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'reply') {
    // Open reply page
    event.waitUntil(
      clients.openWindow(\`/messages/\${event.notification.data.messageId}\`)
    );
  } else if (event.action === 'dismiss') {
    // Just close
  } else {
    // Notification body clicked (no action)
    event.waitUntil(clients.openWindow('/messages'));
  }
});`,
    },

    { type: 'heading', level: 2, text: 'Notification API vs Push API', id: 'notification-vs-push' },
    {
      type: 'table',
      headers: ['Feature', 'Notification API', 'Push API'],
      rows: [
        ['When it works', 'App is open in a tab', 'Even when app is closed'],
        ['Trigger', 'JavaScript in page', 'Server sends push message'],
        ['Requires', 'Notification permission', 'Notification + Push permission'],
        ['Service Worker', 'Optional', 'Required'],
        ['Server setup', 'None', 'Push subscription + VAPID keys'],
        ['Use case', 'In-app alerts', 'Re-engagement, real-time alerts'],
      ],
    },
    { type: 'callout', variant: 'info', title: 'Push Notifications', text: 'The Push API enables notifications even when the app is closed. It requires a Service Worker, a push subscription, and server-side infrastructure (web-push). The Notification API alone only works while the page is open.' },

    { type: 'heading', level: 2, text: 'React Notification Hook', id: 'react-hook' },
    {
      type: 'code', language: 'tsx', filename: 'useNotification.tsx',
      code: `import { useState, useCallback, useEffect } from 'react';

type Permission = NotificationPermission | 'unsupported';

function useNotification() {
  const [permission, setPermission] = useState<Permission>(() => {
    if (!('Notification' in window)) return 'unsupported';
    return Notification.permission;
  });

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) return false;
    const result = await Notification.requestPermission();
    setPermission(result);
    return result === 'granted';
  }, []);

  const notify = useCallback((title: string, options?: NotificationOptions) => {
    if (permission !== 'granted') return null;

    const notification = new Notification(title, options);
    return notification;
  }, [permission]);

  return { permission, requestPermission, notify };
}

// Usage
function TaskManager() {
  const { permission, requestPermission, notify } = useNotification();

  const handleEnableNotifications = async () => {
    const granted = await requestPermission();
    if (granted) {
      notify('Notifications Enabled!', {
        body: 'You\\'ll be notified when tasks complete.',
        icon: '/icon.png',
      });
    }
  };

  const handleTaskComplete = (task: Task) => {
    notify(\`Task Complete: \${task.title}\`, {
      body: \`"\${task.title}" has been completed.\`,
      tag: \`task-\${task.id}\`,
      data: { taskId: task.id },
    });
  };

  return (
    <div>
      {permission === 'default' && (
        <button onClick={handleEnableNotifications}>
          Enable Notifications
        </button>
      )}
      {permission === 'denied' && (
        <p>Notifications are blocked. Enable them in browser settings.</p>
      )}
    </div>
  );
}`,
    },

    { type: 'heading', level: 2, text: 'Notification Queue', id: 'queue' },
    {
      type: 'code', language: 'typescript', filename: 'notification-queue.ts',
      code: `// Prevent overwhelming the user with too many notifications
class NotificationQueue {
  private queue: Array<{ title: string; options: NotificationOptions }> = [];
  private isProcessing = false;
  private minInterval = 3000; // Min 3 seconds between notifications

  add(title: string, options: NotificationOptions = {}) {
    this.queue.push({ title, options });
    if (!this.isProcessing) this.process();
  }

  private async process() {
    this.isProcessing = true;

    while (this.queue.length > 0) {
      const { title, options } = this.queue.shift()!;

      // Group remaining if too many queued
      if (this.queue.length > 3) {
        const count = this.queue.length + 1;
        this.queue = [];
        new Notification(\`\${count} new notifications\`, {
          body: \`You have \${count} unread notifications.\`,
          tag: 'grouped',
        });
        break;
      }

      new Notification(title, options);

      if (this.queue.length > 0) {
        await new Promise(r => setTimeout(r, this.minInterval));
      }
    }

    this.isProcessing = false;
  }
}

const notificationQueue = new NotificationQueue();
notificationQueue.add('Message from Alice', { body: 'Hey!' });
notificationQueue.add('Message from Bob', { body: 'Hello!' });`,
    },

    { type: 'heading', level: 2, text: 'Common Mistakes', id: 'common-mistakes' },
    {
      type: 'code', language: 'javascript', filename: 'mistakes.js',
      code: `// ❌ Mistake 1: Requesting permission on page load
document.addEventListener('DOMContentLoaded', () => {
  Notification.requestPermission(); // Bad UX! No context for the user
});

// ✅ Fix: Request after user clicks a button
enableBtn.addEventListener('click', () => {
  Notification.requestPermission();
});

// ❌ Mistake 2: Not checking for Notification support
new Notification('Hello'); // Crashes in some environments!

// ✅ Fix: Check for support
if ('Notification' in window) {
  new Notification('Hello');
}

// ❌ Mistake 3: Not using tags (spam-like behavior)
messages.forEach(msg => {
  new Notification('New message', { body: msg.text });
  // Creates 50 notifications for 50 messages!
});

// ✅ Fix: Use tags and group
new Notification('New messages', {
  body: \`\${messages.length} new messages\`,
  tag: 'messages',
});

// ❌ Mistake 4: Forgetting HTTPS requirement
// Notifications silently fail on HTTP pages`,
    },

    { type: 'heading', level: 2, text: 'Browser Support', id: 'support' },
    {
      type: 'table',
      headers: ['Feature', 'Chrome', 'Firefox', 'Safari', 'Mobile'],
      rows: [
        ['Basic notifications', '✅', '✅', '✅ (macOS)', '✅ Android / ❌ iOS < 16.4'],
        ['Actions', '✅ (SW only)', '✅ (SW only)', '❌', '✅ Android'],
        ['Image', '✅', '❌', '❌', '✅ Android'],
        ['Badge', '✅', '❌', '❌', '✅ Android'],
        ['Vibrate', '✅', '❌', '❌', '✅ Android'],
        ['requireInteraction', '✅', '✅', '❌', 'Varies'],
      ],
    },

    { type: 'heading', level: 2, text: 'Interview Questions', id: 'interview' },
    {
      type: 'list',
      items: [
        'What is the difference between the Notification API and the Push API?',
        'What are the three notification permission states?',
        'Why can\'t you re-request permission after it\'s denied?',
        'What is the `tag` property used for?',
        'How do notification actions work with Service Workers?',
        'What are the UX best practices for requesting notification permission?',
      ],
    },

    { type: 'heading', level: 2, text: 'Best Practices', id: 'best-practices' },
    {
      type: 'list',
      items: [
        'Never request permission on page load — wait for user interaction',
        'Show a custom prompt explaining the value before the browser prompt',
        'Use tags to prevent duplicate/spam notifications',
        'Keep notification text short and actionable',
        'Provide in-app notification settings (don\'t rely on browser settings)',
        'Group multiple notifications instead of sending many',
        'Include an icon and badge for brand recognition',
        'Handle the click event to navigate the user to relevant content',
        'Test notifications on mobile — behavior varies significantly',
        'Use Service Worker notifications for background capability',
      ],
    },
  ],
};
