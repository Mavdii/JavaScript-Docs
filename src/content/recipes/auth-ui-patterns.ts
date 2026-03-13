import type { RecipeContent } from '@/types/content';

export const authUiPatternsRecipe: RecipeContent = {
  id: 'auth-ui-patterns',
  title: 'Auth UI Patterns',
  description: 'Design login, signup, and password reset flows with good UX.',
  slug: 'recipes/auth-ui-patterns',
  pillar: 'recipes',
  category: 'data-patterns',
  tags: ['auth', 'login', 'signup', 'UX'],
  difficulty: 'intermediate',
  contentType: 'recipe',
  summary: 'Build authentication UI flows including login, registration, password reset, and social auth buttons.',
  relatedTopics: ['form-validation'],
  order: 11,
  updatedAt: '2024-03-01',
  readingTime: 14,
  featured: false,
  keywords: ['login', 'signup', 'auth', 'password reset', 'social login', 'MFA'],
  problem: 'Auth flows need to be secure, accessible, and give users clear feedback at every step.',
  pitfalls: [
    'Telling users if an email is registered (security risk)',
    'No visual feedback on password strength',
    'Forgetting loading states on submit',
    'No rate limiting (easy to brute force)',
    'Storing tokens in localStorage (XSS vulnerability)',
  ],
  variations: ['Email/password', 'Social login (OAuth)', 'Magic link', 'Two-factor authentication', 'Passkeys'],
  sections: [
    { type: 'heading', level: 2, text: 'Login Form', id: 'login' },
    { type: 'code', language: 'tsx', filename: 'LoginForm.tsx', code: `function LoginForm({ onSubmit }: {\\n  onSubmit: (email: string, password: string) => Promise<void>\\n}) {\\n  const [email, setEmail] = useState('');\\n  const [password, setPassword] = useState('');\\n  const [showPassword, setShowPassword] = useState(false);\\n  const [error, setError] = useState('');\\n  const [loading, setLoading] = useState(false);\\n\\n  const handleSubmit = async (e: React.FormEvent) => {\\n    e.preventDefault();\\n    setError('');\\n    setLoading(true);\\n\\n    try {\\n      await onSubmit(email, password);\\n    } catch (err) {\\n      setError('Invalid email or password');\\n    } finally {\\n      setLoading(false);\\n    }\\n  };\\n\\n  return (\\n    <form onSubmit={handleSubmit} className="space-y-4">\\n      <div>\\n        <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>\\n        <input\\n          id="email"\\n          type="email"\\n          value={email}\\n          onChange={e => setEmail(e.target.value)}\\n          required\\n          className="w-full rounded-md border px-3 py-2"\\n          autoComplete="email"\\n        />\\n      </div>\\n      <div>\\n        <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>\\n        <div className="relative">\\n          <input\\n            id="password"\\n            type={showPassword ? 'text' : 'password'}\\n            value={password}\\n            onChange={e => setPassword(e.target.value)}\\n            required\\n            className="w-full rounded-md border px-3 py-2"\\n            autoComplete="current-password"\\n          />\\n          <button\\n            type="button"\\n            onClick={() => setShowPassword(!showPassword)}\\n            className="absolute right-2 top-1/2 -translate-y-1/2 text-sm"\\n          >\\n            {showPassword ? 'Hide' : 'Show'}\\n          </button>\\n        </div>\\n      </div>\\n      {error && <p className="text-sm text-destructive">{error}</p>}\\n      <button\\n        type="submit"\\n        disabled={loading}\\n        className="w-full rounded-md bg-primary text-primary-foreground py-2 disabled:opacity-50"\\n      >\\n        {loading ? 'Signing in...' : 'Sign In'}\\n      </button>\\n    </form>\\n  );\\n}` },

    { type: 'heading', level: 2, text: 'Password Strength Meter', id: 'password-strength' },
    { type: 'code', language: 'typescript', filename: 'passwordStrength.ts', code: `interface PasswordStrength {\\n  score: 0 | 1 | 2 | 3 | 4;\\n  label: string;\\n  color: string;\\n  checks: { label: string; passed: boolean }[];\\n}\\n\\nfunction checkPasswordStrength(password: string): PasswordStrength {\\n  const checks = [\\n    { label: 'At least 8 characters', passed: password.length >= 8 },\\n    { label: 'Contains uppercase', passed: /[A-Z]/.test(password) },\\n    { label: 'Contains lowercase', passed: /[a-z]/.test(password) },\\n    { label: 'Contains number', passed: /[0-9]/.test(password) },\\n    { label: 'Contains special char', passed: /[!@#$%^&*]/.test(password) },\\n  ];\\n\\n  const score = checks.filter(c => c.passed).length;\\n  const labels = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong'];\\n  const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500'];\\n\\n  return {\\n    score: Math.min(score, 4) as 0 | 1 | 2 | 3 | 4,\\n    label: labels[score] || 'Very weak',\\n    color: colors[score] || colors[0],\\n    checks,\\n  };\\n}` },

    { type: 'heading', level: 2, text: 'Strength Meter UI', id: 'strength-ui' },
    { type: 'code', language: 'tsx', filename: 'StrengthMeter.tsx', code: `function PasswordStrengthMeter({ password }: { password: string }) {\\n  const { score, label, color, checks } = checkPasswordStrength(password);\\n  if (!password) return null;\\n\\n  return (\\n    <div className="space-y-2 mt-2">\\n      <div className="flex gap-1">\\n        {Array.from({ length: 4 }, (_, i) => (\\n          <div\\n            key={i}\\n            className={'h-1.5 flex-1 rounded-full transition-colors ' + (i < score ? color : 'bg-muted')}\\n          />\\n        ))}\\n      </div>\\n      <div className="text-xs">\\n        <span className="font-medium">{label}</span>\\n        {checks.some(c => !c.passed) && (\\n          <ul className="mt-1 space-y-0.5">\\n            {checks.filter(c => !c.passed).map(c => (\\n              <li key={c.label} className="text-muted-foreground">• {c.label}</li>\\n            ))}\\n          </ul>\\n        )}\\n      </div>\\n    </div>\\n  );\\n}` },

    { type: 'heading', level: 2, text: 'Social Login Buttons', id: 'social-login' },
    { type: 'code', language: 'tsx', filename: 'SocialAuth.tsx', code: `function SocialAuthButtons() {\\n  return (\\n    <div className="space-y-3">\\n      <div className="relative my-6">\\n        <div className="absolute inset-0 flex items-center">\\n          <div className="w-full border-t" />\\n        </div>\\n        <div className="relative flex justify-center text-xs uppercase">\\n          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>\\n        </div>\\n      </div>\\n      <button className="w-full rounded-md border py-2 flex items-center justify-center gap-2 hover:bg-muted">\\n        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">\\n          {/* Google logo */}\\n        </svg>\\n        Google\\n      </button>\\n      <button className="w-full rounded-md border py-2 flex items-center justify-center gap-2 hover:bg-muted">\\n        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">\\n          {/* GitHub logo */}\\n        </svg>\\n        GitHub\\n      </button>\\n    </div>\\n  );\\n}` },

    { type: 'heading', level: 2, text: 'Password Reset Flow', id: 'password-reset' },
    { type: 'code', language: 'tsx', filename: 'ForgotPassword.tsx', code: `function ForgotPasswordForm() {\\n  const [email, setEmail] = useState('');\\n  const [sent, setSent] = useState(false);\\n  const [loading, setLoading] = useState(false);\\n\\n  const handleSubmit = async (e: React.FormEvent) => {\\n    e.preventDefault();\\n    setLoading(true);\\n    await sendPasswordResetEmail(email);\\n    setSent(true);\\n    setLoading(false);\\n  };\\n\\n  if (sent) {\\n    return (\\n      <div className="text-center space-y-3">\\n        <p className="text-sm text-muted-foreground">\\n          Check your email for a reset link. It expires in 1 hour.\\n        </p>\\n        <button\\n          onClick={() => setSent(false)}\\n          className="text-sm text-primary hover:underline"\\n        >\\n          Didn’t receive it? Try again\\n        </button>\\n      </div>\\n    );\\n  }\\n\\n  return (\\n    <form onSubmit={handleSubmit} className="space-y-4">\\n      <p className="text-sm text-muted-foreground">\\n        Enter your email and we’ll send you a link to reset your password.\\n      </p>\\n      <input\\n        type="email"\\n        value={email}\\n        onChange={e => setEmail(e.target.value)}\\n        placeholder="your@email.com"\\n        required\\n        className="w-full rounded-md border px-3 py-2"\\n      />\\n      <button\\n        type="submit"\\n        disabled={loading}\\n        className="w-full rounded-md bg-primary text-primary-foreground py-2 disabled:opacity-50"\\n      >\\n        {loading ? 'Sending...' : 'Send Reset Link'}\\n      </button>\\n    </form>\\n  );\\n}` },

    { type: 'heading', level: 2, text: 'Token Storage Strategy', id: 'token-storage' },
    { type: 'table', headers: ['Storage', 'XSS Safe', 'CSRF Safe', 'Best For'], rows: [
      ['Memory (variable)', 'Yes', 'Yes', 'Access tokens (short-lived)'],
      ['httpOnly Cookie', 'Yes', 'Needs CSRF token', 'Refresh tokens'],
      ['localStorage', 'No', 'Yes', 'NOT recommended for tokens'],
      ['sessionStorage', 'No', 'Yes', 'Temporary, single-tab use'],
    ]},

    { type: 'heading', level: 2, text: 'Protected Route', id: 'protected-route' },
    { type: 'code', language: 'tsx', filename: 'ProtectedRoute.tsx', code: `function ProtectedRoute({ children }: { children: React.ReactNode }) {\\n  const { user, loading } = useAuth();\\n\\n  if (loading) {\\n    return (\\n      <div className="flex items-center justify-center min-h-screen">\\n        <Spinner />\\n      </div>\\n    );\\n  }\\n\\n  if (!user) {\\n    return <Navigate to="/login" replace state={{ from: location.pathname }} />;\\n  }\\n\\n  return <>{children}</>;\\n}\\n\\n// After login, redirect to where they were going\\nfunction useAuthCallback() {\\n  const location = useLocation();\\n  const from = (location.state as { from: string })?.from || '/dashboard';\\n  return from;\\n}` },

    { type: 'heading', level: 2, text: 'Security Best Practices', id: 'security' },
    { type: 'list', items: [
      'Use generic error messages: "Invalid credentials" not "Wrong password"',
      'Never reveal if an email is registered (password reset should say "if an account exists")',
      'Rate limit login attempts (show CAPTCHA after 3 failures)',
      'Store tokens in memory or httpOnly cookies — never localStorage',
      'Implement CSRF protection for cookie-based auth',
      'Support autofill and password managers (use correct autocomplete attributes)',
      'Add "Show password" toggle for better UX',
      'Log out on all tabs when user logs out on one (use BroadcastChannel)',
    ]},

    { type: 'heading', level: 2, text: 'Accessibility', id: 'accessibility' },
    { type: 'callout', variant: 'tip', title: 'Form Accessibility', text: 'Use proper <label> elements linked to inputs via htmlFor/id. Set autocomplete attributes (email, current-password, new-password). Use role="alert" for error messages so screen readers announce them immediately.' },
  ],
};
