import type { RecipeContent } from '@/types/content';

export const errorFallbackRecipe: RecipeContent = {
  id: 'error-fallback',
  title: 'Error Fallback UX',
  description: 'Design graceful error states with fallback UI and retry actions.',
  slug: 'recipes/error-fallback',
  pillar: 'recipes',
  category: 'performance',
  tags: ['errors', 'fallback', 'UX'],
  difficulty: 'beginner',
  contentType: 'recipe',
  summary: 'Show user-friendly error states with retry buttons, fallback content, and error boundaries.',
  relatedTopics: ['api-retries'],
  order: 8,
  updatedAt: '2024-03-01',
  readingTime: 10,
  featured: false,
  keywords: ['error boundary', 'fallback', 'retry', 'UX', 'resilience'],
  problem: 'Errors happen. Users need clear, honest messages and a way forward.',
  pitfalls: [
    'Showing raw error messages like "TypeError: Cannot read property..."',
    'No retry mechanism (user is stuck)',
    'Silent failures with zero feedback',
    'One error crashes the whole app',
    'Not logging errors for debugging',
  ],
  variations: ['Error boundary (React)', 'Inline error states', 'Toast notifications', 'Full-page error', 'Skeleton fallback'],
  sections: [
    { type: 'heading', level: 2, text: 'React Error Boundary', id: 'error-boundary' },
    { type: 'paragraph', text: 'Error boundaries catch JavaScript errors anywhere in their child component tree and display a fallback UI instead of crashing. They only catch errors during rendering and lifecycle methods — not event handlers or async code.' },
    { type: 'code', language: 'tsx', filename: 'ErrorBoundary.tsx', code: `interface Props {\\n  children: React.ReactNode;\\n  fallback?: React.ReactNode;\\n  onError?: (error: Error, info: React.ErrorInfo) => void;\\n}\\n\\ninterface State {\\n  hasError: boolean;\\n  error: Error | null;\\n}\\n\\nclass ErrorBoundary extends React.Component<Props, State> {\\n  state: State = { hasError: false, error: null };\\n\\n  static getDerivedStateFromError(error: Error): State {\\n    return { hasError: true, error };\\n  }\\n\\n  componentDidCatch(error: Error, info: React.ErrorInfo) {\\n    // Log to error tracking service\\n    console.error('Error caught:', error, info);\\n    this.props.onError?.(error, info);\\n  }\\n\\n  render() {\\n    if (this.state.hasError) {\\n      return this.props.fallback || (\\n        <div className="p-4 border border-destructive rounded-lg bg-destructive/10">\\n          <h2 className="font-bold text-destructive">Something went wrong</h2>\\n          <p className="text-sm text-muted-foreground mt-1">{this.state.error?.message}</p>\\n          <button\\n            onClick={() => this.setState({ hasError: false })}\\n            className="mt-3 px-3 py-1 bg-primary text-primary-foreground rounded text-sm"\\n          >\\n            Try Again\\n          </button>\\n        </div>\\n      );\\n    }\\n\\n    return this.props.children;\\n  }\\n}\\n\\n// Usage\\n<ErrorBoundary onError={(e) => logToSentry(e)}>\\n  <YourComponent />\\n</ErrorBoundary>` },

    { type: 'heading', level: 2, text: 'Inline Error State', id: 'inline' },
    { type: 'code', language: 'tsx', filename: 'ErrorState.tsx', code: `interface ErrorStateProps {\\n  title?: string;\\n  message: string;\\n  onRetry?: () => void;\\n  icon?: React.ReactNode;\\n}\\n\\nfunction ErrorState({\\n  title = 'Error',\\n  message,\\n  onRetry,\\n  icon = <AlertCircle className="h-8 w-8 text-destructive" />\\n}: ErrorStateProps) {\\n  return (\\n    <div role="alert" className="flex flex-col items-center justify-center p-8 text-center">\\n      {icon}\\n      <h3 className="text-lg font-semibold mt-4">{title}</h3>\\n      <p className="text-sm text-muted-foreground mt-2 max-w-sm">{message}</p>\\n      {onRetry && (\\n        <button\\n          onClick={onRetry}\\n          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"\\n        >\\n          Try Again\\n        </button>\\n      )}\\n    </div>\\n  );\\n}` },

    { type: 'heading', level: 2, text: 'Async State Machine', id: 'state-machine' },
    { type: 'paragraph', text: 'Model fetch operations as explicit states — idle, loading, success, or error. This makes it impossible to accidentally show both data and error states simultaneously.' },
    { type: 'code', language: 'typescript', filename: 'useAsync.ts', code: `type AsyncState<T> =\\n  | { status: 'idle' }\\n  | { status: 'loading' }\\n  | { status: 'success'; data: T }\\n  | { status: 'error'; error: Error };\\n\\nfunction useAsync<T>(asyncFn: () => Promise<T>, deps: any[] = []) {\\n  const [state, setState] = useState<AsyncState<T>>({ status: 'idle' });\\n\\n  const execute = useCallback(async () => {\\n    setState({ status: 'loading' });\\n    try {\\n      const data = await asyncFn();\\n      setState({ status: 'success', data });\\n    } catch (error) {\\n      setState({ status: 'error', error: error instanceof Error ? error : new Error('Unknown error') });\\n    }\\n  }, [asyncFn]);\\n\\n  useEffect(() => {\\n    execute();\\n  }, deps);\\n\\n  return { ...state, execute };\\n}` },

    { type: 'heading', level: 2, text: 'Using the State Machine', id: 'state-machine-usage' },
    { type: 'code', language: 'tsx', filename: 'DataView.tsx', code: `function UserList() {\\n  const state = useAsync(() => fetch('/api/users').then(r => r.json()));\\n\\n  switch (state.status) {\\n    case 'idle':\\n    case 'loading':\\n      return <Skeleton count={5} />;\\n    case 'error':\\n      return (\\n        <ErrorState\\n          message={state.error.message}\\n          onRetry={state.execute}\\n        />\\n      );\\n    case 'success':\\n      return (\\n        <ul>\\n          {state.data.map(user => (\\n            <li key={user.id}>{user.name}</li>\\n          ))}\\n        </ul>\\n      );\\n  }\\n}` },

    { type: 'heading', level: 2, text: 'Toast Notifications for Errors', id: 'toast-errors' },
    { type: 'code', language: 'typescript', filename: 'errorToast.ts', code: `import { toast } from 'sonner';\\n\\nfunction showError(error: Error, options?: { retry?: () => void }) {\\n  toast.error('Something went wrong', {\\n    description: getUserFriendlyMessage(error),\\n    action: options?.retry\\n      ? { label: 'Retry', onClick: options.retry }\\n      : undefined,\\n    duration: 5000,\\n  });\\n}\\n\\n// Map technical errors to user-friendly messages\\nfunction getUserFriendlyMessage(error: Error): string {\\n  const message = error.message.toLowerCase();\\n  if (message.includes('fetch') || message.includes('network')) {\\n    return 'Network error. Check your connection and try again.';\\n  }\\n  if (message.includes('404') || message.includes('not found')) {\\n    return 'The requested resource was not found.';\\n  }\\n  if (message.includes('401') || message.includes('unauthorized')) {\\n    return 'Your session expired. Please log in again.';\\n  }\\n  if (message.includes('403') || message.includes('forbidden')) {\\n    return "You don't have permission to do that.";\\n  }\\n  return 'Something went wrong. Please try again.';\\n}` },

    { type: 'heading', level: 2, text: 'Full-Page Error', id: 'full-page' },
    { type: 'code', language: 'tsx', filename: 'ErrorPage.tsx', code: `function ErrorPage({ statusCode = 500 }: { statusCode?: number }) {\\n  const messages: Record<number, { title: string; desc: string }> = {\\n    404: { title: 'Page Not Found', desc: 'The page you\\'re looking for doesn\\'t exist.' },\\n    403: { title: 'Access Denied', desc: 'You don\\'t have permission to view this page.' },\\n    500: { title: 'Server Error', desc: 'Something went wrong on our end. We\\'re working on it.' },\\n  };\\n\\n  const msg = messages[statusCode] || messages[500];\\n\\n  return (\\n    <div className="flex items-center justify-center min-h-screen bg-background">\\n      <div className="text-center space-y-4">\\n        <div className="text-6xl font-bold text-muted-foreground">{statusCode}</div>\\n        <h1 className="text-2xl font-bold">{msg.title}</h1>\\n        <p className="text-muted-foreground max-w-sm">{msg.desc}</p>\\n        <a href="/" className="inline-block mt-6 px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">\\n          Go Home\\n        </a>\\n      </div>\\n    </div>\\n  );\\n}` },

    { type: 'heading', level: 2, text: 'Graceful Degradation Pattern', id: 'graceful-degradation' },
    { type: 'paragraph', text: 'Instead of showing an error, degrade gracefully by showing cached data, placeholder content, or a simplified view. Users get something useful instead of nothing.' },
    { type: 'code', language: 'tsx', filename: 'GracefulData.tsx', code: `function DataWithFallback<T>({\\n  data, error, fallback, children\\n}: {\\n  data: T | null;\\n  error: Error | null;\\n  fallback: T;\\n  children: (data: T) => React.ReactNode;\\n}) {\\n  if (error && !data) {\\n    // Show fallback data with warning\\n    return (\\n      <div>\\n        <div className="bg-yellow-50 border border-yellow-200 rounded p-2 mb-4 text-sm">\\n          ⚠️ Showing cached data. Some information may be outdated.\\n        </div>\\n        {children(fallback)}\\n      </div>\\n    );\\n  }\\n\\n  return children(data ?? fallback);\\n}` },

    { type: 'heading', level: 2, text: 'Error Logging', id: 'error-logging' },
    { type: 'callout', variant: 'tip', title: 'Production Error Tracking', text: 'Always log errors to a service like Sentry, LogRocket, or Datadog. Include context: user ID, route, component stack, and timestamps. Never show stack traces to end users.' },

    { type: 'heading', level: 2, text: 'Design Principles', id: 'design-principles' },
    { type: 'list', items: [
      'Be honest: tell users something went wrong, but skip the technical jargon',
      'Be actionable: always provide a next step (retry, go home, contact support)',
      'Be contextual: show errors near the component that failed, not at the top',
      'Be persistent: don\'t auto-dismiss errors that require user action',
      'Be forgiving: preserve user input across retries (don\'t clear forms)',
    ]},
  ],
};
