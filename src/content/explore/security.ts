import type { ExploreContent } from '@/types/content';

export const securityExplore: ExploreContent = {
  id: 'explore-security',
  title: 'JavaScript Security',
  description: 'Learn security best practices for JavaScript applications including XSS prevention, CSRF protection, and secure coding patterns.',
  slug: 'explore/security',
  pillar: 'explore',
  category: 'tooling',
  tags: ['security', 'xss', 'csrf', 'csp', 'owasp'],
  difficulty: 'intermediate',
  contentType: 'library',
  summary: 'Comprehensive guide to JavaScript security — XSS prevention, CSRF tokens, Content Security Policy, input sanitization, dependency auditing, and OWASP top vulnerabilities.',
  relatedTopics: [],
  order: 8,
  updatedAt: '2025-06-01',
  readingTime: 22,
  featured: true,
  keywords: ['security', 'XSS', 'CSRF', 'CSP', 'input sanitization', 'OWASP'],
  items: [
    {
      name: 'OWASP Top 10',
      description: 'Most critical web security risks',
      url: 'https://owasp.org/www-project-top-ten/',
    },
    {
      name: 'Content Security Policy',
      description: 'Mitigate XSS attacks with CSP headers',
      url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP',
    },
    {
      name: 'npm audit',
      description: 'Scan for vulnerable dependencies',
      url: 'https://docs.npmjs.com/cli/v8/commands/npm-audit',
    },
    {
      name: 'DOMPurify',
      description: 'Sanitize HTML to prevent XSS',
      url: 'https://github.com/cure53/DOMPurify',
    },
    {
      name: 'Snyk',
      description: 'Continuous vulnerability scanning',
      url: 'https://snyk.io',
    },
  ],
  sections: [
    {
      type: 'heading',
      level: 2,
      text: 'Cross-Site Scripting (XSS) Prevention',
      id: 'xss-prevention',
    },
    {
      type: 'paragraph',
      text: 'XSS attacks inject malicious scripts into web pages. The primary defense is escaping user input and using Content Security Policy.',
    },
    {
      type: 'code',
      language: 'typescript',
      code: `// ❌ VULNERABLE: Never do this!
function renderUserComment(comment: string) {
  const html = \`<div class="comment">\${comment}</div>\`;
  document.getElementById('comments').innerHTML = html;

  // If comment contains: <img src=x onerror="alert('XSS')">
  // The script will execute!
}

// ✅ SAFE: Escape HTML entities
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}

function renderUserCommentSafe(comment: string) {
  const escaped = escapeHtml(comment);
  document.getElementById('comments').innerHTML = \`
    <div class="comment">\${escaped}</div>
  \`;
}

// ✅ SAFER: Use textContent instead of innerHTML
function renderUserCommentSafer(comment: string) {
  const el = document.createElement('div');
  el.className = 'comment';
  el.textContent = comment; // Text is never parsed as HTML
  document.getElementById('comments').appendChild(el);
}

// ✅ BEST: Use DOMPurify for rich HTML
import DOMPurify from 'dompurify';

function renderRichComment(comment: string) {
  const clean = DOMPurify.sanitize(comment, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p'],
    ALLOWED_ATTR: ['href'],
  });
  document.getElementById('comments').innerHTML = clean;
}`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Cross-Site Request Forgery (CSRF) Protection',
      id: 'csrf-protection',
    },
    {
      type: 'paragraph',
      text: 'CSRF attacks trick users into making unintended requests. Protect by validating requests with CSRF tokens.',
    },
    {
      type: 'code',
      language: 'typescript',
      code: `// Server generates CSRF token
app.get('/form', (req, res) => {
  const csrfToken = crypto.randomBytes(32).toString('hex');
  req.session.csrfToken = csrfToken;

  res.send(\`
    <form method="POST" action="/submit">
      <input type="hidden" name="_csrf" value="\${csrfToken}">
      <input type="text" name="data">
      <button type="submit">Submit</button>
    </form>
  \`);
});

// Server validates CSRF token
app.post('/submit', (req, res) => {
  const token = req.body._csrf;

  if (token !== req.session.csrfToken) {
    return res.status(403).send('CSRF validation failed');
  }

  // Process request
  res.send('Success');
});

// Frontend: Include token in AJAX requests
async function submitForm(data: any) {
  const csrfToken = document.querySelector('input[name="_csrf"]')
    ?.getAttribute('value');

  const response = await fetch('/api/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken || '',
    },
    body: JSON.stringify(data),
  });

  return response.json();
}`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Content Security Policy (CSP)',
      id: 'csp',
    },
    {
      type: 'paragraph',
      text: 'CSP headers control which resources can be loaded and executed, mitigating XSS and data exfiltration attacks.',
    },
    {
      type: 'code',
      language: 'typescript',
      code: `// Set CSP headers (Express.js)
import helmet from 'helmet';

app.use(helmet.contentSecurityPolicy({
  directives: {
    // Only allow scripts from same origin
    scriptSrc: ["'self'", 'trusted-cdn.example.com'],

    // Only allow styles from same origin and inline styles
    styleSrc: ["'self'", "'unsafe-inline'"],

    // Only load images from same origin and HTTPS
    imgSrc: ["'self'", 'https:', 'data:'],

    // Restrict form submissions
    formAction: ["'self'"],

    // Restrict iframe sources
    frameSrc: ["'self'", 'https://trusted.example.com'],

    // Don't allow any plugins
    objectSrc: ["'none'"],

    // Report CSP violations
    reportUri: '/csp-report',

    // Restrict to HTTPS (including iframes)
    upgradeInsecureRequests: [],
  },
}));

// Handle CSP violation reports
app.post('/csp-report', (req, res) => {
  const violation = req.body['csp-report'];
  console.error('CSP Violation:', {
    blocked: violation['blocked-uri'],
    source: violation['source-file'],
    line: violation['line-number'],
  });

  // Log to security monitoring service
  res.status(204).send();
});

// Frontend: Be aware of CSP restrictions
// ❌ BLOCKED by strict CSP
document.onclick = () => alert('Inline handlers not allowed');

// ✅ ALLOWED
document.addEventListener('click', () => {
  console.log('Safe event listener');
});

// ❌ BLOCKED
const script = document.createElement('script');
script.textContent = 'console.log("Inline script")';
document.body.appendChild(script);

// ✅ ALLOWED (from same origin or whitelisted)
const script2 = document.createElement('script');
script2.src = '/js/app.js';
document.body.appendChild(script2);`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Input Validation & Sanitization',
      id: 'input-validation',
    },
    {
      type: 'code',
      language: 'typescript',
      code: `// Validation patterns
const patterns = {
  email: /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/,
  url: /^https?:\\/\\/.+/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  phone: /^\\+?[1-9]\\d{1,14}$/,
};

// Validate input
function validateEmail(email: string): boolean {
  return patterns.email.test(email);
}

function validateURL(url: string): boolean {
  try {
    new URL(url);
    return patterns.url.test(url);
  } catch {
    return false;
  }
}

// Sanitize for database (prevent SQL injection)
function escapeSql(value: string): string {
  return value
    .replace(/\\\\/g, '\\\\\\\\')
    .replace(/'/g, "\\\\'")
    .replace(/"/g, '\\\\"');
}

// ✅ Better: Use parameterized queries
const query = 'SELECT * FROM users WHERE email = ?';
db.query(query, [userEmail]);

// Validate before processing
interface UserInput {
  email: string;
  username: string;
  age: number;
}

function validateUserInput(input: any): UserInput | null {
  if (!input || typeof input !== 'object') return null;

  const { email, username, age } = input;

  if (typeof email !== 'string' || !validateEmail(email)) {
    throw new Error('Invalid email');
  }

  if (typeof username !== 'string' || username.length < 3) {
    throw new Error('Username must be 3+ characters');
  }

  if (typeof age !== 'number' || age < 0 || age > 150) {
    throw new Error('Invalid age');
  }

  return { email, username, age };
}`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Dependency Management & Auditing',
      id: 'dependency-auditing',
    },
    {
      type: 'code',
      language: 'bash',
      code: `# Check for known vulnerabilities
npm audit

# Fix automatically
npm audit fix

# Check specific packages
npm audit --json

# Remove unused dependencies
npm prune

# Check outdated packages
npm outdated

# Use npm ci for deterministic installs
npm ci

# Lock versions to prevent unexpected updates
npm install --save-exact package-name`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Secure Authentication Patterns',
      id: 'auth-security',
    },
    {
      type: 'code',
      language: 'typescript',
      code: `// ❌ INSECURE: Never store passwords
const users = {
  'user1': 'password123', // Plain text!
};

// ✅ SECURE: Hash passwords with bcrypt
import bcrypt from 'bcrypt';

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10); // 10 salt rounds
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Handle login securely
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).send('Missing credentials');
  }

  // Find user (don't reveal if user exists)
  const user = await db.users.findOne({ email });
  if (!user) {
    return res.status(401).send('Invalid credentials');
  }

  // Verify password
  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return res.status(401).send('Invalid credentials');
  }

  // Create secure session
  const token = crypto.randomBytes(32).toString('hex');
  await db.sessions.create({
    token,
    userId: user.id,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
  });

  // Send secure HTTP-only cookie
  res.cookie('sessionToken', token, {
    httpOnly: true,
    secure: true, // HTTPS only
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.send('Logged in');
});

// Store secrets in environment variables
const dbPassword = process.env.DB_PASSWORD;
const apiKey = process.env.API_KEY;

if (!dbPassword || !apiKey) {
  throw new Error('Missing required environment variables');
}`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'OWASP Top 10 for JavaScript',
      id: 'owasp-top-10',
    },
    {
      type: 'table',
      headers: ['Rank', 'Vulnerability', 'Prevention'],
      rows: [
        ['1', 'Broken Access Control', 'Validate permissions server-side'],
        ['2', 'Cryptographic Failures', 'Use HTTPS, hash passwords'],
        ['3', 'Injection', 'Use parameterized queries, sanitize input'],
        ['4', 'Insecure Design', 'Threat modeling, secure defaults'],
        ['5', 'Security Misconfiguration', 'Security headers, disable defaults'],
        ['6', 'Vulnerable Components', 'Keep dependencies updated'],
        ['7', 'Authentication Failures', 'Strong passwords, 2FA, secure sessions'],
        ['8', 'Software/Data Integrity', 'Verify dependencies, sign code'],
        ['9', 'Logging Failures', 'Log security events, monitor'],
        ['10', 'SSRF', 'Validate URLs, allow-list endpoints'],
      ],
    },
    {
      type: 'heading',
      level: 2,
      text: 'Security Best Practices Checklist',
      id: 'checklist',
    },
    {
      type: 'list',
      items: [
        'Use HTTPS everywhere',
        'Validate and sanitize all user input',
        'Escape output to prevent XSS',
        'Use CSRF tokens for state-changing requests',
        'Implement CSP headers',
        'Hash passwords with bcrypt/argon2',
        'Use secure, HTTP-only cookies',
        'Implement rate limiting on APIs',
        'Log security events',
        'Keep dependencies updated',
        'Use npm audit regularly',
        'Never commit secrets to version control',
        'Use environment variables for sensitive data',
        'Implement proper error handling (don\'t leak details)',
        'Use security headers (X-Frame-Options, X-Content-Type-Options)',
      ],
    },
  ],
};
