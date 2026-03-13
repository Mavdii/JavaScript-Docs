import type { RecipeContent } from '@/types/content';

export const formValidationRecipe: RecipeContent = {
  id: 'form-validation',
  title: 'Form Validation',
  description: 'Client-side form validation patterns with real-time feedback.',
  slug: 'recipes/form-validation',
  pillar: 'recipes',
  category: 'ui-patterns',
  tags: ['forms', 'validation'],
  difficulty: 'beginner',
  contentType: 'recipe',
  summary: 'Validate user input with real-time feedback using native APIs and custom logic.',
  relatedTopics: ['debouncing'],
  order: 2,
  updatedAt: '2024-03-01',
  readingTime: 12,
  featured: false,
  keywords: ['validation', 'form', 'input', 'required', 'Zod', 'React Hook Form'],
  problem: 'Forms need real-time validation feedback without drowning users in error messages.',
  pitfalls: [
    'Validating on every keystroke without debouncing (annoying)',
    'Not showing errors until submit (surprises users)',
    'Missing server-side validation (clients lie)',
    'Not preserving input on error (lose user\'s work)',
    'Inaccessible error messages (screen readers skip them)',
  ],
  variations: ['Inline validation on blur', 'Schema-based with Zod', 'HTML5 constraint validation API', 'Multi-step form validation'],
  sections: [
    { type: 'heading', level: 2, text: 'Basic Validation Functions', id: 'basic' },
    { type: 'code', language: 'typescript', filename: 'validators.ts', code: `// Composable validators\\ntype Validator = (value: string) => string | null;\\n\\nconst required: Validator = (v) => v.trim() ? null : 'This field is required';\\n\\nconst minLength = (min: number): Validator => (v) =>\\n  v.length >= min ? null : \\\`Must be at least \\\${min} characters\\\`;\\n\\nconst maxLength = (max: number): Validator => (v) =>\\n  v.length <= max ? null : \\\`Must be at most \\\${max} characters\\\`;\\n\\nconst email: Validator = (v) => {\\n  const re = /^[^\\\\s@]+@[^\\\\s@]+\\\\.[^\\\\s@]+$/;\\n  return re.test(v) ? null : 'Invalid email address';\\n};\\n\\n// Combine validators\\nconst compose = (...validators: Validator[]): Validator => (v) => {\\n  for (const validator of validators) {\\n    const error = validator(v);\\n    if (error) return error;\\n  }\\n  return null;\\n};\\n\\nconst emailValidator = compose(required, email);` },

    { type: 'heading', level: 2, text: 'Form Validation Hook', id: 'form-hook' },
    { type: 'code', language: 'typescript', filename: 'useFormValidation.ts', code: `type ValidationRules<T> = {\\n  [K in keyof T]?: Validator;\\n};\\n\\nfunction useFormValidation<T extends Record<string, string>>(\\n  initialValues: T,\\n  rules: ValidationRules<T>\\n) {\\n  const [values, setValues] = useState(initialValues);\\n  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});\\n  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});\\n\\n  const setValue = (field: keyof T, value: string) => {\\n    setValues(prev => ({ ...prev, [field]: value }));\\n  };\\n\\n  const validate = (field: keyof T) => {\\n    const validator = rules[field];\\n    if (!validator) return;\\n    const error = validator(values[field]);\\n    setErrors(prev => ({ ...prev, [field]: error || undefined }));\\n  };\\n\\n  const handleBlur = (field: keyof T) => {\\n    setTouched(prev => ({ ...prev, [field]: true }));\\n    validate(field);\\n  };\\n\\n  const validateAll = () => {\\n    const newErrors: Partial<Record<keyof T, string>> = {};\\n    for (const field in rules) {\\n      const validator = rules[field as keyof T];\\n      if (validator) {\\n        const error = validator(values[field as keyof T]);\\n        if (error) newErrors[field as keyof T] = error;\\n      }\\n    }\\n    setErrors(newErrors);\\n    return Object.keys(newErrors).length === 0;\\n  };\\n\\n  return { values, setValue, errors, touched, handleBlur, validateAll };\\n}` },

    { type: 'heading', level: 2, text: 'Input Component with Validation', id: 'input-component' },
    { type: 'code', language: 'tsx', filename: 'FormField.tsx', code: `function FormField({\\n  label, name, type = 'text', error, touched, ...inputProps\\n}: {\\n  label: string;\\n  name: string;\\n  type?: string;\\n  error?: string;\\n  touched?: boolean;\\n} & React.InputHTMLAttributes<HTMLInputElement>) {\\n  const showError = touched && error;\\n\\n  return (\\n    <div className="space-y-1">\\n      <label htmlFor={name} className="text-sm font-medium">\\n        {label}\\n      </label>\\n      <input\\n        id={name}\\n        type={type}\\n        className={\\\`w-full rounded-md border px-3 py-2 \\\${\\n          showError ? 'border-destructive' : 'border-input'\\n        }\\\`}\\n        aria-invalid={showError}\\n        aria-describedby={showError ? \\\`\\\${name}-error\\\` : undefined}\\n        {...inputProps}\\n      />\\n      {showError && (\\n        <p id={\\\`\\\${name}-error\\\`} className="text-sm text-destructive\" role="alert">\\n          {error}\\n        </p>\\n      )}\\n    </div>\\n  );\\n}` },

    { type: 'heading', level: 2, text: 'Zod Schema Validation', id: 'zod' },
    { type: 'code', language: 'typescript', filename: 'schema.ts', code: `import { z } from 'zod';\\n\\nconst signupSchema = z.object({\\n  email: z.string().email('Invalid email address'),\\n  password: z\\n    .string()\\n    .min(8, 'Must be at least 8 characters')\\n    .regex(/[A-Z]/, 'Must contain an uppercase letter')\\n    .regex(/[0-9]/, 'Must contain a number'),\\n  confirmPassword: z.string(),\\n  username: z\\n    .string()\\n    .min(3, 'Min 3 characters')\\n    .max(20, 'Max 20 characters')\\n    .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores'),\\n}).refine((data) => data.password === data.confirmPassword, {\\n  message: 'Passwords must match',\\n  path: ['confirmPassword'],\\n});\\n\\ntype SignupData = z.infer<typeof signupSchema>;` },

    { type: 'heading', level: 2, text: 'React Hook Form + Zod', id: 'rhf-zod' },
    { type: 'code', language: 'tsx', filename: 'SignupForm.tsx', code: `import { useForm } from 'react-hook-form';\\nimport { zodResolver } from '@hookform/resolvers/zod';\\n\\nfunction SignupForm() {\\n  const {\\n    register,\\n    handleSubmit,\\n    formState: { errors, isSubmitting },\\n  } = useForm<SignupData>({\\n    resolver: zodResolver(signupSchema),\\n    mode: 'onBlur', // validate on blur, not on every keystroke\\n  });\\n\\n  const onSubmit = async (data: SignupData) => {\\n    const res = await fetch('/api/signup', {\\n      method: 'POST',\\n      headers: { 'Content-Type': 'application/json' },\\n      body: JSON.stringify(data),\\n    });\\n    if (!res.ok) throw new Error('Signup failed');\\n  };\\n\\n  return (\\n    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">\\n      <FormField label="Email" {...register('email')} error={errors.email?.message} />\\n      <FormField label="Username" {...register('username')} error={errors.username?.message} />\\n      <FormField label="Password" type="password" {...register('password')} error={errors.password?.message} />\\n      <FormField label="Confirm Password" type="password" {...register('confirmPassword')} error={errors.confirmPassword?.message} />\\n      <button type="submit" disabled={isSubmitting} className="w-full rounded-md bg-primary text-primary-foreground py-2 disabled:opacity-50">\\n        {isSubmitting ? 'Creating account...' : 'Sign Up'}\\n      </button>\\n    </form>\\n  );\\n}` },

    { type: 'heading', level: 2, text: 'Async Validation', id: 'async-validation' },
    { type: 'paragraph', text: 'Some validations need the server — like checking if a username is taken. Debounce these calls to avoid hammering your server.' },
    { type: 'code', language: 'typescript', filename: 'asyncValidator.ts', code: `// Debounced async validator\\nfunction useAsyncValidator(\\n  value: string,\\n  validate: (v: string) => Promise<string | null>,\\n  delay = 500\\n) {\\n  const [error, setError] = useState<string | null>(null);\\n  const [checking, setChecking] = useState(false);\\n\\n  useEffect(() => {\\n    if (!value) { setError(null); return; }\\n\\n    setChecking(true);\\n    const timer = setTimeout(async () => {\\n      const result = await validate(value);\\n      setError(result);\\n      setChecking(false);\\n    }, delay);\\n\\n    return () => {\\n      clearTimeout(timer);\\n      setChecking(false);\\n    };\\n  }, [value, validate, delay]);\\n\\n  return { error, checking };\\n}\\n\\n// Usage\\nfunction UsernameField() {\\n  const [username, setUsername] = useState('');\\n  const { error, checking } = useAsyncValidator(\\n    username,\\n    async (u) => {\\n      const res = await fetch(\\\`/api/check-username?u=\\\${u}\\\`);\\n      const data = await res.json();\\n      return data.taken ? 'Username is taken' : null;\\n    }\\n  );\\n\\n  return (\\n    <div>\\n      <input value={username} onChange={(e) => setUsername(e.target.value)} />\\n      {checking && <span>Checking...</span>}\\n      {error && <span className="text-destructive">{error}</span>}\\n    </div>\\n  );\\n}` },

    { type: 'heading', level: 2, text: 'Multi-Step Form Validation', id: 'multi-step' },
    { type: 'code', language: 'typescript', filename: 'multiStep.ts', code: `// Validate each step independently\\nconst stepSchemas = [\\n  z.object({ email: z.string().email(), name: z.string().min(1) }),\\n  z.object({ password: z.string().min(8), confirmPassword: z.string() }),\\n  z.object({ plan: z.enum(['free', 'pro', 'enterprise']) }),\\n];\\n\\nfunction useMultiStepForm(steps: z.ZodSchema[]) {\\n  const [currentStep, setCurrentStep] = useState(0);\\n  const [formData, setFormData] = useState({});\\n  const [errors, setErrors] = useState<Record<string, any>>({});\\n\\n  const nextStep = async () => {\\n    const schema = steps[currentStep];\\n    try {\\n      await schema.parseAsync(formData);\\n      if (currentStep < steps.length - 1) {\\n        setCurrentStep(s => s + 1);\\n      }\\n    } catch (err) {\\n      if (err instanceof z.ZodError) {\\n        setErrors(err.flatten().fieldErrors);\\n      }\\n    }\\n  };\\n\\n  return { currentStep, formData, setFormData, errors, nextStep };\\n}` },

    { type: 'heading', level: 2, text: 'Validation Timing Strategy', id: 'timing' },
    { type: 'table', headers: ['Strategy', 'When', 'Best For'], rows: [
      ['On submit', 'Form submission', 'Simple forms, fewer fields'],
      ['On blur', 'When field loses focus', 'Most forms (recommended)'],
      ['On change (debounced)', 'While typing (with delay)', 'Search, username checks'],
      ['Eager then lazy', 'On blur first, then on change', 'Best UX for complex forms'],
    ]},

    { type: 'heading', level: 2, text: 'Accessibility', id: 'accessibility' },
    { type: 'list', items: [
      'Link error messages to inputs with aria-describedby',
      'Set aria-invalid="true" on fields with errors',
      'Use role="alert" on error messages for screen reader announcements',
      'Don\'t rely only on color to indicate errors — add icons or text',
      'Focus the first field with an error after failed submission',
      'Use native validation attributes (required, type, pattern) as a baseline',
    ]},

    { type: 'callout', variant: 'warning', title: 'Server-Side Validation', text: 'Client-side validation is for UX only — it can be bypassed. ALWAYS validate on the server too. Never trust client input.' },
  ],
};
