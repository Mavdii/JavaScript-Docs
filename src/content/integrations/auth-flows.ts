import type { IntegrationContent } from '@/types/content';

export const authFlowsIntegration: IntegrationContent = {
  id: 'integration-auth-flows',
  title: 'Authentication Flows',
  description: 'Implement common auth patterns: login, signup, password reset, and social auth.',
  slug: 'integrations/auth-flows',
  pillar: 'integrations',
  category: 'auth-payments',
  tags: ['authentication', 'login', 'signup', 'JWT'],
  difficulty: 'intermediate',
  contentType: 'integration',
  summary: 'A practical guide to implementing authentication in JavaScript apps — covering JWT, session-based auth, and social login patterns.',
  relatedTopics: ['integration-oauth', 'auth-ui-patterns'],
  order: 6,
  updatedAt: '2025-06-01',
  readingTime: 14,
  featured: false,
  keywords: ['JWT', 'authentication', 'login', 'sessions'],
  requiredLibraries: ['fetch (built-in)', 'jsonwebtoken (server)'],
  setupSteps: ['Choose an auth strategy (JWT vs sessions)', 'Set up backend endpoints', 'Implement token storage'],
  authNotes: 'JWTs should be short-lived. Use refresh tokens for extended sessions.',
  sections: [
    { type: 'heading', level: 2, text: 'JWT vs Session-Based Authentication', id: 'jwt-vs-sessions' },
    { type: 'table', headers: ['Feature', 'JWT (Stateless)', 'Sessions (Stateful)'], rows: [
      ['Storage', 'Client-side (memory/cookie)', 'Server-side (DB/Redis)'],
      ['Scalability', 'Excellent — no server state', 'Requires shared session store'],
      ['Revocation', 'Difficult — must wait for expiry', 'Easy — delete session from store'],
      ['Size', 'Larger (contains claims)', 'Small cookie ID'],
      ['Mobile-friendly', 'Yes — works without cookies', 'Harder — requires cookie support'],
      ['XSS risk', 'High if stored in localStorage', 'Lower with httpOnly cookies'],
    ]},

    { type: 'heading', level: 2, text: 'JWT Authentication Flow', id: 'jwt-flow' },
    { type: 'code', language: 'typescript', code: `// Auth service — handles login, signup, token management
class AuthService {
  private accessToken: string | null = null;
  private refreshTimer: ReturnType<typeof setTimeout> | null = null;

  async login(email: string, password: string): Promise<User> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // Send/receive httpOnly cookies (refresh token)
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new AuthError(error.code, error.message);
    }

    const { user, accessToken, expiresIn } = await res.json();

    // Store access token in memory only — NOT localStorage
    this.accessToken = accessToken;
    this.scheduleRefresh(expiresIn);

    return user;
  }

  async signup(data: {
    email: string;
    password: string;
    name: string;
  }): Promise<User> {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json();
      if (error.code === 'EMAIL_EXISTS') {
        throw new AuthError('EMAIL_EXISTS', 'An account with this email already exists');
      }
      throw new AuthError(error.code, error.message);
    }

    const { user, accessToken, expiresIn } = await res.json();
    this.accessToken = accessToken;
    this.scheduleRefresh(expiresIn);
    return user;
  }

  async logout(): Promise<void> {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } finally {
      this.accessToken = null;
      if (this.refreshTimer) clearTimeout(this.refreshTimer);
    }
  }

  async refreshAccessToken(): Promise<void> {
    const res = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include', // Refresh token sent via httpOnly cookie
    });

    if (!res.ok) {
      this.accessToken = null;
      throw new AuthError('SESSION_EXPIRED', 'Please log in again');
    }

    const { accessToken, expiresIn } = await res.json();
    this.accessToken = accessToken;
    this.scheduleRefresh(expiresIn);
  }

  private scheduleRefresh(expiresInSeconds: number): void {
    if (this.refreshTimer) clearTimeout(this.refreshTimer);
    // Refresh 60 seconds before expiry
    const refreshIn = (expiresInSeconds - 60) * 1000;
    this.refreshTimer = setTimeout(() => this.refreshAccessToken(), refreshIn);
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }
}` },

    { type: 'heading', level: 2, text: 'Auth Error Handling', id: 'error-handling' },
    { type: 'code', language: 'typescript', code: `class AuthError extends Error {
  constructor(
    public code: string,
    message: string,
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

// User-friendly error messages
const AUTH_ERROR_MESSAGES: Record<string, string> = {
  INVALID_CREDENTIALS: 'Email or password is incorrect',
  EMAIL_EXISTS: 'An account with this email already exists',
  WEAK_PASSWORD: 'Password must be at least 8 characters with a number and special character',
  TOO_MANY_ATTEMPTS: 'Too many login attempts. Please try again in 15 minutes',
  SESSION_EXPIRED: 'Your session has expired. Please log in again',
  EMAIL_NOT_VERIFIED: 'Please verify your email before logging in',
  ACCOUNT_LOCKED: 'Account locked due to suspicious activity. Contact support',
};

function getAuthErrorMessage(code: string): string {
  return AUTH_ERROR_MESSAGES[code] || 'An unexpected error occurred. Please try again.';
}` },

    { type: 'heading', level: 2, text: 'React Auth Context', id: 'react-context' },
    { type: 'code', language: 'tsx', code: `interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const authService = useRef(new AuthService()).current;

  // Check for existing session on mount
  useEffect(() => {
    authService.refreshAccessToken()
      .then(() => fetchUser())
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  async function fetchUser() {
    const token = authService.getAccessToken();
    if (!token) return;

    const res = await fetch('/api/auth/me', {
      headers: { Authorization: \`Bearer \${token}\` },
    });
    if (res.ok) {
      setUser(await res.json());
    }
  }

  async function login(email: string, password: string) {
    const user = await authService.login(email, password);
    setUser(user);
  }

  async function signup(data: SignupData) {
    const user = await authService.signup(data);
    setUser(user);
  }

  async function logout() {
    await authService.logout();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}` },

    { type: 'heading', level: 2, text: 'Protected Routes', id: 'protected-routes' },
    { type: 'code', language: 'tsx', code: `function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen"><Spinner /></div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

// Role-based protection
function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  // Never check roles client-side for authorization!
  // This is for UX only — server must enforce
  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

// Usage
<Routes>
  <Route path="/login" element={<LoginPage />} />
  <Route path="/dashboard" element={
    <ProtectedRoute><DashboardPage /></ProtectedRoute>
  } />
  <Route path="/admin" element={
    <AdminRoute><AdminPage /></AdminRoute>
  } />
</Routes>` },
    { type: 'callout', variant: 'danger', title: 'Client-Side Role Checks Are UX Only', text: 'Never rely on client-side role checks for actual authorization. The server must verify permissions on every request. Client-side checks prevent UI flicker but provide zero security.' },

    { type: 'heading', level: 2, text: 'Password Reset Flow', id: 'password-reset' },
    { type: 'code', language: 'typescript', code: `// Step 1: Request password reset
async function requestPasswordReset(email: string): Promise<void> {
  await fetch('/api/auth/forgot-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  // Always show success â don’t reveal if email exists
}

// Step 2: Reset with token (from email link)
async function resetPassword(token: string, newPassword: string): Promise<void> {
  const res = await fetch('/api/auth/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, password: newPassword }),
  });

  if (!res.ok) {
    const error = await res.json();
    if (error.code === 'TOKEN_EXPIRED') {
      throw new AuthError('TOKEN_EXPIRED', 'Reset link has expired. Request a new one.');
    }
    throw new AuthError(error.code, error.message);
  }
}

// Password strength validation
function validatePasswordStrength(password: string): {
  score: number; // 0-4
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) score++;
  else feedback.push('At least 8 characters');

  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  else feedback.push('Mix of uppercase and lowercase');

  if (/\\d/.test(password)) score++;
  else feedback.push('At least one number');

  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
  else feedback.push('At least one special character');

  return { score, feedback };
}` },

    { type: 'heading', level: 2, text: 'Security Checklist', id: 'security' },
    { type: 'list', items: [
      'Store access tokens in memory — never in localStorage (XSS risk)',
      'Use httpOnly, Secure, SameSite cookies for refresh tokens',
      'Implement CSRF protection if using cookie-based auth',
      'Rate-limit login attempts (e.g., 5 per 15 minutes per IP)',
      'Hash passwords with bcrypt or Argon2 server-side — never SHA/MD5',
      'Use short-lived access tokens (5-15 min) with refresh tokens',
      'Log all authentication events for audit trail',
      'Implement account lockout after repeated failed attempts',
      'Never reveal whether an email exists during password reset',
      'Validate password strength on both client and server',
    ] },
    { type: 'callout', variant: 'warning', title: 'Token Storage', text: 'localStorage is accessible to any JavaScript on the page — a single XSS vulnerability exposes all tokens. Store access tokens in a JavaScript closure (memory variable) and refresh tokens in httpOnly cookies.' },
  ],
};
