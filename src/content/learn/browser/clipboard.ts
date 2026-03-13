import type { LessonContent } from '@/types/content';

export const clipboardLesson: LessonContent = {
  id: 'clipboard',
  title: 'Clipboard API',
  description: 'Copy stuff to the clipboard, paste it back — the modern way without all the browser weirdness.',
  slug: 'learn/browser/clipboard',
  pillar: 'learn',
  category: 'browser',
  tags: ['clipboard', 'copy', 'paste', 'browser'],
  difficulty: 'beginner',
  contentType: 'lesson',
  summary: 'The Clipboard API gives you async methods to read and write text and files to the system clipboard. It replaces the old document.execCommand approach that nobody really liked.',
  relatedTopics: ['fetch'],
  order: 4,
  updatedAt: '2024-03-01',
  readingTime: 12,
  featured: false,
  keywords: ['clipboard', 'copy', 'paste', 'navigator.clipboard', 'writeText', 'readText', 'ClipboardItem', 'permissions'],
  prerequisites: ['Async/Await'],
  learningGoals: [
    'Copy text to clipboard and handle success/failure',
    'Request clipboard permissions properly',
    'Copy fancy stuff like HTML and images',
    'Build copy buttons that actually work',
    'Know when to fall back to older browser APIs',
  ],
  exercises: [
    'Build a copy button that shows "Copied!" feedback for 2 seconds.',
    'Create a code block that automatically copies when you click the button.',
    'Make a paste handler that reads images from the clipboard and displays them.',
    'Build a share button that copies your app URL to the clipboard.',
  ],
  sections: [
    { type: 'heading', level: 2, text: 'Overview', id: 'overview' },
    { type: 'paragraph', text: 'The Clipboard API (`navigator.clipboard`) is the modern, async way to interact with your system clipboard. It replaces the synchronous `document.execCommand("copy")` approach. You need HTTPS and the user has to grant permission to read.' },
    { type: 'paragraph', text: 'There are two levels to this API: the simple text methods (`writeText`/`readText`) for basic text stuff, and the full methods (`write`/`read`) for fancy content like HTML and images.' },

    { type: 'heading', level: 2, text: 'Writing Text to Clipboard', id: 'writing' },
    {
      type: 'code', language: 'javascript', filename: 'copy.js',
      code: `async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    console.log('Copied!');
    return true;
  } catch (err) {
    console.error('Copy failed:', err);
    return false;
  }
}

// Usage
await copyToClipboard('Hello, World!');

// Copy current page URL
await copyToClipboard(window.location.href);

// Copy formatted data
const data = { name: 'Alice', email: 'alice@example.com' };
await copyToClipboard(JSON.stringify(data, null, 2));`,
    },

    { type: 'heading', level: 2, text: 'Reading Text from Clipboard', id: 'reading' },
    {
      type: 'code', language: 'javascript', filename: 'paste.js',
      code: `async function pasteFromClipboard() {
  try {
    const text = await navigator.clipboard.readText();
    console.log('Pasted:', text);
    return text;
  } catch (err) {
    console.error('Paste failed:', err);
    return null;
  }
}

// Usage — paste into an input
pasteButton.addEventListener('click', async () => {
  const text = await pasteFromClipboard();
  if (text) {
    inputField.value = text;
  }
});`,
    },
    { type: 'callout', variant: 'warning', title: 'Permission Watch', text: 'Reading the clipboard always asks for permission — the browser will show a prompt. Writing usually works fine without asking if the user did something (clicked a button, etc.). Never read silently; users hate surprise clipboard access.' },

    { type: 'heading', level: 2, text: 'Permission Handling', id: 'permissions' },
    {
      type: 'code', language: 'javascript', filename: 'permissions.js',
      code: `// Check permission status
async function checkClipboardPermission() {
  try {
    const result = await navigator.permissions.query({
      name: 'clipboard-read',
    });

    console.log('Permission:', result.state);
    // 'granted' | 'denied' | 'prompt'

    result.addEventListener('change', () => {
      console.log('Permission changed to:', result.state);
    });

    return result.state;
  } catch {
    // permissions.query not supported for clipboard in some browsers
    return 'unknown';
  }
}

// Graceful copy with permission check
async function safeCopy(text) {
  if (!navigator.clipboard) {
    return fallbackCopy(text);
  }

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return fallbackCopy(text);
  }
}`,
    },

    { type: 'heading', level: 2, text: 'Copying Rich Content', id: 'rich-content' },
    { type: 'paragraph', text: 'Want to copy more than just text? The `write()` method takes `ClipboardItem` objects so you can copy HTML, images, and multiple formats at once.' },
    {
      type: 'code', language: 'javascript', filename: 'rich-copy.js',
      code: `// Copy HTML content
async function copyHTML(html, plainText) {
  const item = new ClipboardItem({
    'text/html': new Blob([html], { type: 'text/html' }),
    'text/plain': new Blob([plainText], { type: 'text/plain' }),
  });

  await navigator.clipboard.write([item]);
}

// Usage: copy formatted text
await copyHTML(
  '<strong>Hello</strong> <em>World</em>',
  'Hello World'
);

// Copy an image
async function copyImage(imageBlob) {
  const item = new ClipboardItem({
    [imageBlob.type]: imageBlob,
  });
  await navigator.clipboard.write([item]);
}

// Copy image from canvas
async function copyCanvas(canvas) {
  const blob = await new Promise(resolve =>
    canvas.toBlob(resolve, 'image/png')
  );
  await copyImage(blob);
}`,
    },

    { type: 'heading', level: 2, text: 'Reading Rich Content', id: 'reading-rich' },
    {
      type: 'code', language: 'javascript', filename: 'read-rich.js',
      code: `// Read all clipboard items
async function readClipboard() {
  const items = await navigator.clipboard.read();

  for (const item of items) {
    console.log('Types:', item.types);

    for (const type of item.types) {
      const blob = await item.getType(type);

      if (type === 'text/plain') {
        const text = await blob.text();
        console.log('Text:', text);
      } else if (type === 'text/html') {
        const html = await blob.text();
        console.log('HTML:', html);
      } else if (type.startsWith('image/')) {
        const url = URL.createObjectURL(blob);
        console.log('Image URL:', url);
      }
    }
  }
}

// Handle paste event for images
document.addEventListener('paste', async (e) => {
  const items = e.clipboardData?.items;
  if (!items) return;

  for (const item of items) {
    if (item.type.startsWith('image/')) {
      const file = item.getAsFile();
      const url = URL.createObjectURL(file);
      // Display or upload the pasted image
      previewImage(url);
    }
  }
});`,
    },

    { type: 'heading', level: 2, text: 'React Copy Button', id: 'react-copy' },
    {
      type: 'code', language: 'tsx', filename: 'CopyButton.tsx',
      code: `import { useState, useCallback } from 'react';

function CopyButton({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'error'>('idle');

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setStatus('copied');
      setTimeout(() => setStatus('idle'), 2000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 2000);
    }
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      aria-label={status === 'copied' ? 'Copied to clipboard' : label}
    >
      {status === 'idle' && label}
      {status === 'copied' && '✓ Copied!'}
      {status === 'error' && '✗ Failed'}
    </button>
  );
}

// Reusable hook
function useClipboard(timeout = 2000) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), timeout);
      return true;
    } catch {
      return false;
    }
  }, [timeout]);

  return { copied, copy };
}

// Usage
function ShareLink({ url }: { url: string }) {
  const { copied, copy } = useClipboard();
  return (
    <button onClick={() => copy(url)}>
      {copied ? 'Link copied!' : 'Share link'}
    </button>
  );
}`,
    },

    { type: 'heading', level: 2, text: 'Code Block with Copy', id: 'code-block' },
    {
      type: 'code', language: 'tsx', filename: 'CodeBlock.tsx',
      code: `function CodeBlock({ code, language }: { code: string; language: string }) {
  const { copied, copy } = useClipboard();

  return (
    <div className="relative group">
      <pre className="bg-gray-900 text-white p-4 rounded overflow-x-auto">
        <code className={\`language-\${language}\`}>{code}</code>
      </pre>
      <button
        onClick={() => copy(code)}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Copy code"
      >
        {copied ? '✓' : '📋'}
      </button>
    </div>
  );
}`,
    },

    { type: 'heading', level: 2, text: 'Legacy Fallback', id: 'fallback' },
    { type: 'paragraph', text: 'For older browsers that don\'t support `navigator.clipboard`, fall back to the old `document.execCommand` approach. It\'s not fancy but it works.' },
    {
      type: 'code', language: 'javascript', filename: 'fallback.js',
      code: `function fallbackCopy(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;

  // Prevent scrolling to bottom
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  textarea.style.top = '-9999px';

  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  try {
    const success = document.execCommand('copy');
    return success;
  } catch {
    return false;
  } finally {
    document.body.removeChild(textarea);
  }
}

// Universal copy function
async function universalCopy(text) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return fallbackCopy(text);
    }
  }
  return fallbackCopy(text);
}`,
    },
    { type: 'callout', variant: 'info', title: 'Old School', text: '`document.execCommand` is officially deprecated but still works. Use it only as a backup when the modern Clipboard API isn\'t available.' },

    { type: 'heading', level: 2, text: 'Clipboard API Support', id: 'support' },
    {
      type: 'table',
      headers: ['Method', 'Chrome', 'Firefox', 'Safari', 'Edge'],
      rows: [
        ['writeText()', '66+', '63+', '13.1+', '79+'],
        ['readText()', '66+', '125+', '13.1+', '79+'],
        ['write() (ClipboardItem)', '76+', '127+', '13.1+', '79+'],
        ['read() (ClipboardItem)', '76+', '127+', '13.1+', '79+'],
      ],
    },

    { type: 'heading', level: 2, text: 'Common Mistakes', id: 'common-mistakes' },
    {
      type: 'code', language: 'javascript', filename: 'mistakes.js',
      code: `// ❌ Mistake 1: Copying without user gesture
// This will be blocked in most browsers:
window.addEventListener('load', () => {
  navigator.clipboard.writeText('sneaky copy'); // DOMException!
});

// ✅ Fix: Only copy in response to user action (click, keydown)
button.addEventListener('click', () => {
  navigator.clipboard.writeText('user-initiated copy');
});

// ❌ Mistake 2: Not handling errors
navigator.clipboard.writeText(text); // Unhandled promise rejection!

// ✅ Fix: Always use try/catch
try {
  await navigator.clipboard.writeText(text);
} catch (err) {
  console.error('Copy failed:', err);
  fallbackCopy(text);
}

// ❌ Mistake 3: Assuming clipboard is always available
navigator.clipboard.writeText(text); // TypeError on HTTP pages!

// ✅ Fix: Check for availability
if (navigator.clipboard?.writeText) {
  await navigator.clipboard.writeText(text);
} else {
  fallbackCopy(text);
}`,
    },

    { type: 'heading', level: 2, text: 'Security & Privacy', id: 'security' },
    {
      type: 'list',
      items: [
        'Clipboard API requires HTTPS (you can\'t use it on unsecured pages)',
        'Reading requires explicit user permission — you\'ll see a browser prompt',
        'Writing only works in response to user actions (clicks, keypresses)',
        'Browsers may clean up pasted HTML to prevent sneaky script injection',
        'Never read the clipboard without the user knowing — it\'s a privacy violation',
        'Some work environments disable clipboard access via policy',
      ],
    },

    { type: 'heading', level: 2, text: 'Interview Questions', id: 'interview' },
    {
      type: 'list',
      items: [
        'What\'s the difference between the Clipboard API and document.execCommand?',
        'Why do you need a user gesture to copy/paste?',
        'How do you copy an image to the clipboard?',
        'What permissions are needed for reading vs writing?',
        'How would you implement a copy function that works in all browsers?',
      ],
    },

    { type: 'heading', level: 2, text: 'Best Practices', id: 'best-practices' },
    {
      type: 'list',
      items: [
        'Always show visual feedback when you copy (✓ Copied!)',
        'Use try/catch and provide a fallback for older browsers',
        'Only copy when the user explicitly asks for it',
        'Add aria-labels to copy buttons for accessibility',
        'When copying fancy content, always include plain text as a backup',
        'Don\'t read the clipboard unless the user asked for it and understands why',
        'Reset the "copied" state after 1-3 seconds so it doesn\'t confuse users',
      ],
    },
  ],
};
