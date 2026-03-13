import type { ExploreContent } from '@/types/content';

export const librariesExplore: ExploreContent = {
  id: 'explore-libraries',
  title: 'JavaScript Libraries',
  description: 'A curated directory of essential JavaScript libraries and frameworks.',
  slug: 'explore/libraries',
  pillar: 'explore',
  category: 'directories',
  tags: ['libraries', 'frameworks', 'npm', 'tools'],
  difficulty: 'beginner',
  contentType: 'library',
  summary: 'Discover the most useful JavaScript libraries organized by category — from UI frameworks to utility libraries, data fetching, animation, and state management.',
  relatedTopics: ['explore-tooling'],
  order: 1,
  updatedAt: '2025-06-01',
  readingTime: 18,
  featured: true,
  keywords: ['JavaScript libraries', 'npm packages', 'frameworks'],
  sections: [
    { type: 'heading', level: 2, text: 'UI Frameworks', id: 'ui-frameworks' },
    { type: 'paragraph', text: 'Modern JavaScript UI frameworks for building interactive web applications. Each has different philosophies around reactivity, templating, and component architecture.' },
    { type: 'table', headers: ['Framework', 'Approach', 'Bundle Size', 'Learning Curve', 'Best For'], rows: [
      ['React', 'Virtual DOM, JSX', '~44 KB', 'Medium', 'Large apps, ecosystem'],
      ['Vue.js', 'Reactive, SFC', '~33 KB', 'Low', 'Progressive adoption'],
      ['Svelte', 'Compiler, no VDOM', '~2 KB', 'Low', 'Performance-critical'],
      ['Solid', 'Fine-grained reactivity', '~7 KB', 'Medium', 'React-like without VDOM'],
      ['Preact', 'React-compatible, tiny', '~3 KB', 'Low', 'Size-constrained apps'],
    ]},
    { type: 'code', language: 'javascript', code: `// React — Declarative component model
function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>;
}

// Vue 3 — Composition API
const Counter = {
  setup() {
    const count = ref(0);
    return { count };
  },
  template: '<button @click="count++">Count: {{ count }}</button>'
};

// Svelte — Compiler magic (no runtime)
// <script>
//   let count = 0;
// </script>
// <button on:click={() => count++}>Count: {count}</button>` },

    { type: 'heading', level: 2, text: 'State Management', id: 'state-management' },
    { type: 'paragraph', text: 'Libraries for managing complex application state beyond simple component state.' },
    { type: 'table', headers: ['Library', 'Pattern', 'Bundle', 'React-specific'], rows: [
      ['Zustand', 'Simple stores', '~1 KB', 'Yes'],
      ['Jotai', 'Atomic state', '~2 KB', 'Yes'],
      ['Redux Toolkit', 'Flux pattern', '~11 KB', 'Yes (adapter)'],
      ['Valtio', 'Proxy-based', '~3 KB', 'Yes'],
      ['XState', 'State machines', '~15 KB', 'No (framework-agnostic)'],
    ]},
    { type: 'code', language: 'javascript', code: `// Zustand — minimal and powerful
import { create } from 'zustand';

const useStore = create((set) => ({
  count: 0,
  increment: () => set((s) => ({ count: s.count + 1 })),
  reset: () => set({ count: 0 }),
}));

function Counter() {
  const { count, increment } = useStore();
  return <button onClick={increment}>{count}</button>;
}

// Jotai — atomic primitives (like React signals)
import { atom, useAtom } from 'jotai';

const countAtom = atom(0);
const doubleAtom = atom((get) => get(countAtom) * 2); // derived

function Counter() {
  const [count, setCount] = useAtom(countAtom);
  const [double] = useAtom(doubleAtom);
  return <div>{count} × 2 = {double}</div>;
}` },

    { type: 'heading', level: 2, text: 'Data Fetching & Caching', id: 'data-fetching' },
    { type: 'paragraph', text: 'Libraries that handle fetching, caching, and synchronizing remote data.' },
    { type: 'code', language: 'javascript', code: `// TanStack Query (React Query) — powerful data sync
import { useQuery, useMutation } from '@tanstack/react-query';

function Users() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetch('/api/users').then(r => r.json()),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <ul>{data.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}

// SWR — simple data fetching
import useSWR from 'swr';

function Users() {
  const { data, error } = useSWR('/api/users', fetcher);
  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;
  return <ul>{data.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}` },

    { type: 'heading', level: 2, text: 'Routing', id: 'routing' },
    { type: 'table', headers: ['Library', 'Type', 'Best For'], rows: [
      ['React Router', 'Client-side', 'SPAs with complex routes'],
      ['TanStack Router', 'Modern, type-safe', 'Type-safe routing in React'],
      ['Next.js', 'Full-stack framework', 'SSR, file-based routing'],
      ['Remix', 'Full-stack, forms-first', 'Server-side rendering and actions'],
    ]},

    { type: 'heading', level: 2, text: 'Styling', id: 'styling' },
    { type: 'paragraph', text: 'Different approaches to styling React components.' },
    { type: 'table', headers: ['Approach', 'Library', 'Pro', 'Con'], rows: [
      ['Utility-first CSS', 'Tailwind CSS', 'Fast, consistent', 'Large HTML class names'],
      ['CSS-in-JS', 'Styled Components', 'Scoped, dynamic', 'Runtime overhead'],
      ['Utility library', 'clsx/classnames', 'Conditional classes', 'Manual'],
      ['Headless UI', 'Headless UI', 'Accessible, unstyled', 'Need to style everything'],
    ]},

    { type: 'heading', level: 2, text: 'Form Handling', id: 'forms' },
    { type: 'code', language: 'javascript', code: `// React Hook Form — lightweight, performant
import { useForm } from 'react-hook-form';

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email', { required: true })} />
      {errors.email && <span>Email is required</span>}
      
      <input {...register('password', { minLength: 6 })} />
      {errors.password && <span>Password must be 6+ characters</span>}
      
      <button type="submit">Login</button>
    </form>
  );
}

// Formik — battle-tested, full-featured
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  email: Yup.string().email().required(),
  password: Yup.string().min(6).required(),
});

function LoginForm() {
  return (
    <Formik initialValues={{ email: '', password: '' }} validationSchema={validationSchema} onSubmit={submit}>
      <Form>
        <Field name="email" />
        <ErrorMessage name="email" />
        
        <Field name="password" type="password" />
        <ErrorMessage name="password" />
        
        <button type="submit">Login</button>
      </Form>
    </Formik>
  );
}` },

    { type: 'heading', level: 2, text: 'Animation & Motion', id: 'animation' },
    { type: 'table', headers: ['Library', 'Type', 'Best For'], rows: [
      ['Framer Motion', 'React animation library', 'Smooth, interactive animations'],
      ['React Spring', 'Physics-based', 'Natural, spring-like animations'],
      ['GSAP', 'Animation toolkit', 'Complex, timeline-based animations'],
      ['Animate.css', 'CSS classes', 'Quick entrance/exit animations'],
    ]},

    { type: 'heading', level: 2, text: 'Testing', id: 'testing' },
    { type: 'table', headers: ['Tool', 'Purpose', 'Best For'], rows: [
      ['Vitest', 'Unit testing', 'Fast, Vite-native testing'],
      ['Jest', 'Unit testing', 'Mature ecosystem'],
      ['Testing Library', 'Component testing', 'User-centric testing'],
      ['Playwright', 'E2E testing', 'Cross-browser testing'],
    ]},

    { type: 'heading', level: 2, text: 'Utility Libraries', id: 'utilities' },
    { type: 'table', headers: ['Library', 'Purpose', 'Size'], rows: [
      ['lodash', 'Utility functions', '~70 KB'],
      ['lodash-es', 'Tree-shakeable lodash', 'smaller'],
      ['date-fns', 'Date manipulation', '~13 KB'],
      ['Day.js', 'Lightweight date library', '~2 KB'],
      ['qs', 'Query string parsing', '~4 KB'],
    ]},

    { type: 'callout', variant: 'tip', title: 'Bundle Size Matters', text: 'Check bundle size before adding libraries. Use bundlephobia.com to compare. A 10KB library used on every page adds up fast.' },
  ],
  items: [
    { name: 'React', description: 'The most popular UI library for building interactive web applications', url: 'https://react.dev' },
    { name: 'Vue.js', description: 'Progressive framework for building user interfaces', url: 'https://vuejs.org' },
    { name: 'Svelte', description: 'Compiler framework that produces minimal JavaScript', url: 'https://svelte.dev' },
    { name: 'TanStack Query', description: 'Powerful asynchronous state management for fetching and caching', url: 'https://tanstack.com/query' },
    { name: 'Zustand', description: 'Lightweight state management library', url: 'https://github.com/pmndrs/zustand' },
    { name: 'React Router', description: 'Standard routing library for React applications', url: 'https://reactrouter.com' },
    { name: 'Tailwind CSS', description: 'Utility-first CSS framework for rapid UI development', url: 'https://tailwindcss.com' },
    { name: 'Framer Motion', description: 'Production-ready motion library for React', url: 'https://www.framer.com/motion' },
    { name: 'React Hook Form', description: 'Performant, flexible form validation library', url: 'https://react-hook-form.com' },
    { name: 'date-fns', description: 'Modern date utility library', url: 'https://date-fns.org' },
  ],
};
