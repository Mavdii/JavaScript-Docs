import type { RecipeContent } from '@/types/content';

export const routeGuardsRecipe: RecipeContent = {
  id: 'recipe-route-guards',
  title: 'Route Guards and Navigation Middleware',
  description: 'Control access to routes with authentication, authorization, and navigation middleware.',
  slug: 'recipes/route-guards',
  pillar: 'recipes',
  category: 'performance',
  tags: ['routing', 'guards', 'auth', 'middleware', 'navigation'],
  difficulty: 'intermediate',
  contentType: 'recipe',
  summary: 'Implement route guards to protect routes based on authentication, user roles, and application state.',
  relatedTopics: ['async-await', 'promises', 'event-handling'],
  order: 6,
  updatedAt: '2025-06-01',
  readingTime: 11,
  featured: false,
  keywords: ['route guard', 'auth', 'navigation', 'middleware', 'protection'],
  problem: 'You need to protect routes from unauthorized access, redirect users, and handle async checks (like permission verification).',
  pitfalls: [
    'Not handling async auth checks properly',
    'Race conditions with concurrent navigation',
    'Not cleaning up listeners on route change',
    'Missing fallback after guard rejection',
    'Not differentiating between auth and authorization failures'
  ],
  variations: ['Auth guard', 'Role guard', 'Permission guard', 'Unsaved changes guard'],
  sections: [
    { type: 'heading', level: 2, text: 'Basic Route Guard System', id: 'basic-guard' },
    { type: 'code', language: 'javascript', filename: 'route-guard-basic.js', code: `class Router {
  constructor() {
    this.routes = new Map();
    this.guards = [];
    this.currentRoute = null;
    this.isNavigating = false;
  }

  define(path, handler, options = {}) {
    this.routes.set(path, {
      handler,
      guards: options.guards || [],
      ...options
    });
  }

  addGlobalGuard(guard) {
    this.guards.push(guard);
  }

  async navigate(path, params = {}) {
    if (this.isNavigating) {
      console.warn('Navigation already in progress');
      return false;
    }

    this.isNavigating = true;

    try {
      const route = this.routes.get(path);
      
      if (!route) {
        console.error('Route not found:', path);
        this.isNavigating = false;
        return false;
      }

      // Run global guards
      for (const guard of this.guards) {
        const canPass = await guard(path, this.currentRoute);
        if (!canPass) {
          console.log('Blocked by global guard');
          this.isNavigating = false;
          return false;
        }
      }

      // Run route-specific guards
      for (const guard of route.guards) {
        const canPass = await guard(path, this.currentRoute, params);
        if (!canPass) {
          console.log('Blocked by route guard');
          this.isNavigating = false;
          return false;
        }
      }

      // All guards passed, navigate
      this.currentRoute = { path, params };
      await route.handler(params);
      
      // Update URL
      window.history.pushState({}, '', path);
      
      return true;

    } finally {
      this.isNavigating = false;
    }
  }
}

// Usage
const router = new Router();

// Define routes
router.define('/dashboard', (params) => {
  document.getElementById('app').innerHTML = '<h1>Dashboard</h1>';
});

router.define('/profile', (params) => {
  document.getElementById('app').innerHTML = '<h1>Profile</h1>';
});

router.define('/admin', (params) => {
  document.getElementById('app').innerHTML = '<h1>Admin</h1>';
}, {
  guards: [
    async (path, from, params) => {
      // Check if user is admin
      const user = await getUser();
      return user && user.role === 'admin';
    }
  ]
});

// Navigation
document.addEventListener('click', async (e) => {
  const link = e.target.closest('a[data-route]');
  if (link) {
    e.preventDefault();
    await router.navigate(link.dataset.route);
  }
});` },

    { type: 'heading', level: 2, text: 'Authentication Guard', id: 'auth-guard' },
    { type: 'code', language: 'javascript', filename: 'route-guard-auth.js', code: `class AuthGuard {
  constructor(authService) {
    this.authService = authService;
    this.loginUrl = '/login';
  }

  // Check if user is authenticated
  async canActivate(path, from) {
    const user = await this.authService.getUser();
    
    if (!user) {
      console.log('Not authenticated, redirecting to login');
      window.location.href = this.loginUrl;
      return false;
    }

    return true;
  }

  // Check if user is logged out
  async canActivateIfNotAuthenticated(path, from) {
    const user = await this.authService.getUser();
    
    if (user) {
      console.log('Already authenticated, redirecting to dashboard');
      window.location.href = '/dashboard';
      return false;
    }

    return true;
  }

  // Check if token is still valid
  async canActivateIfTokenValid(path, from) {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      return false;
    }

    try {
      const response = await fetch('/api/verify-token', {
        headers: { 'Authorization': \`Bearer \${token}\` }
      });

      if (!response.ok) {
        localStorage.removeItem('authToken');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Token verification failed:', error);
      return false;
    }
  }
}

// Usage with router
const authGuard = new AuthGuard(authService);

router.addGlobalGuard((path, from) => authGuard.canActivateIfTokenValid(path, from));

router.define('/login', loginHandler, {
  guards: [(path, from) => authGuard.canActivateIfNotAuthenticated(path, from)]
});

router.define('/dashboard', dashboardHandler, {
  guards: [(path, from) => authGuard.canActivate(path, from)]
});` },

    { type: 'heading', level: 2, text: 'Role-Based Access Control (RBAC)', id: 'rbac-guard' },
    { type: 'code', language: 'javascript', filename: 'route-guard-rbac.js', code: `class RoleGuard {
  async canActivateWithRole(requiredRoles) {
    return async (path, from) => {
      const user = await getUser();
      
      if (!user) {
        console.log('User not authenticated');
        return false;
      }

      // Check if user has required role
      const hasRole = requiredRoles.some(role => user.roles.includes(role));
      
      if (!hasRole) {
        console.log('User lacks required role(s):', requiredRoles);
        return false;
      }

      return true;
    };
  }

  async canActivateWithPermission(requiredPermissions) {
    return async (path, from) => {
      const user = await getUser();
      
      if (!user) {
        return false;
      }

      // Check if user has all required permissions
      const hasAllPermissions = requiredPermissions.every(perm =>
        user.permissions.includes(perm)
      );

      if (!hasAllPermissions) {
        console.log('User lacks required permissions:', requiredPermissions);
        return false;
      }

      return true;
    };
  }
}

// Usage
const roleGuard = new RoleGuard();

router.define('/admin', adminHandler, {
  guards: [await roleGuard.canActivateWithRole(['admin'])]
});

router.define('/analytics', analyticsHandler, {
  guards: [await roleGuard.canActivateWithRole(['admin', 'analyst'])]
});

router.define('/delete-user', deleteUserHandler, {
  guards: [
    await roleGuard.canActivateWithPermission(['user.delete', 'admin.access'])
  ]
});` },

    { type: 'heading', level: 2, text: 'Unsaved Changes Guard', id: 'unsaved-changes' },
    { type: 'code', language: 'javascript', filename: 'route-guard-unsaved.js', code: `class UnsavedChangesGuard {
  constructor() {
    this.hasUnsavedChanges = false;
    this.setupListeners();
  }

  setupListeners() {
    document.addEventListener('input', () => {
      this.hasUnsavedChanges = true;
    });

    document.addEventListener('change', () => {
      this.hasUnsavedChanges = true;
    });

    // Warn before leaving page
    window.addEventListener('beforeunload', (e) => {
      if (this.hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Leave anyway?';
      }
    });
  }

  async canDeactivate(fromPath, toPath) {
    if (!this.hasUnsavedChanges) {
      return true;
    }

    // Ask user for confirmation
    return await this.confirmNavigation();
  }

  async confirmNavigation() {
    return new Promise((resolve) => {
      const confirmed = confirm(
        'You have unsaved changes. Do you want to leave without saving?'
      );
      resolve(confirmed);
    });
  }

  markAsClean() {
    this.hasUnsavedChanges = false;
  }

  markAsDirty() {
    this.hasUnsavedChanges = true;
  }
}

// Usage
const unsavedGuard = new UnsavedChangesGuard();

router.define('/edit', editHandler, {
  guards: [
    async (path, from) => {
      if (from && from.path === '/edit') {
        return await unsavedGuard.canDeactivate(from.path, path);
      }
      return true;
    }
  ]
});

// After saving
function saveForm() {
  // Save logic...
  unsavedGuard.markAsClean();
}` },

    { type: 'heading', level: 2, text: 'Parallel Route Guards', id: 'parallel-guards' },
    { type: 'code', language: 'javascript', filename: 'route-guard-parallel.js', code: `class GuardExecutor {
  // Run all guards in parallel
  static async executeInParallel(guards, path, from, params) {
    try {
      const results = await Promise.all(
        guards.map(guard => Promise.resolve(guard(path, from, params)))
      );

      // All must pass
      return results.every(result => result === true);
    } catch (error) {
      console.error('Guard error:', error);
      return false;
    }
  }

  // Run guards sequentially (stop at first failure)
  static async executeSequentially(guards, path, from, params) {
    for (const guard of guards) {
      try {
        const result = await Promise.resolve(guard(path, from, params));
        if (result !== true) {
          return false;
        }
      } catch (error) {
        console.error('Guard error:', error);
        return false;
      }
    }
    return true;
  }

  // Run with timeout
  static async executeWithTimeout(guards, path, from, params, timeout = 5000) {
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Guard timeout')), timeout)
    );

    const guardsPromise = this.executeInParallel(guards, path, from, params);

    try {
      return await Promise.race([guardsPromise, timeoutPromise]);
    } catch (error) {
      console.error('Guard execution timeout:', error);
      return false;
    }
  }
}

// Usage
router.define('/dashboard', dashboardHandler, {
  guards: [
    authGuard.canActivate,
    roleGuard.canActivateWithRole(['user', 'admin']),
    async (path, from) => {
      // Check feature flag
      const isEnabled = await checkFeatureFlag('dashboard');
      return isEnabled;
    }
  ]
});

// Execute guards with timeout
const executor = new GuardExecutor();
const canNavigate = await executor.executeWithTimeout(
  route.guards,
  path,
  currentRoute,
  {},
  3000
);` },

    { type: 'heading', level: 2, text: 'Real-World: Complete SPA Router', id: 'complete-spa' },
    { type: 'code', language: 'javascript', filename: 'router-complete.js', code: `class SPARouter {
  constructor(rootElement) {
    this.root = rootElement;
    this.routes = new Map();
    this.guards = [];
    this.currentRoute = null;
    this.isNavigating = false;
    this.history = [];

    this.setupPopstate();
    this.setupLinkHandlers();
  }

  setupPopstate() {
    window.addEventListener('popstate', (e) => {
      const path = window.location.pathname;
      this.navigate(path, e.state);
    });
  }

  setupLinkHandlers() {
    this.root.addEventListener('click', async (e) => {
      const link = e.target.closest('a[href^="/"]');
      if (link && !link.target) {
        e.preventDefault();
        await this.navigate(link.href);
      }
    });
  }

  define(path, handler, options = {}) {
    this.routes.set(path, {
      handler,
      guards: options.guards || [],
      title: options.title || 'App'
    });
  }

  addGlobalGuard(guard) {
    this.guards.push(guard);
  }

  async navigate(path, state = {}) {
    if (this.isNavigating) return;
    this.isNavigating = true;

    try {
      const route = this.routes.get(path);
      
      if (!route) {
        console.error('Route not found:', path);
        return false;
      }

      // Run guards
      const canNavigate = await this.executeGuards(
        [...this.guards, ...route.guards],
        path
      );

      if (!canNavigate) {
        this.isNavigating = false;
        return false;
      }

      // Render
      this.root.innerHTML = '';
      await route.handler();

      // Update URL and title
      window.history.pushState(
        { path },
        route.title,
        path
      );
      document.title = route.title;

      this.currentRoute = { path, route };
      this.history.push(path);

      return true;

    } finally {
      this.isNavigating = false;
    }
  }

  async executeGuards(guards, path) {
    for (const guard of guards) {
      try {
        const result = await Promise.resolve(
          guard(path, this.currentRoute)
        );
        if (result !== true) {
          return false;
        }
      } catch (error) {
        console.error('Guard error:', error);
        return false;
      }
    }
    return true;
  }

  go(path) {
    window.history.go(path);
  }

  back() {
    window.history.back();
  }
}

// Real-world setup
const router = new SPARouter(document.getElementById('app'));

// Auth service
async function getUser() {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const res = await fetch('/api/user', {
      headers: { 'Authorization': \`Bearer \${token}\` }
    });
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
}

// Guards
const authGuard = async (path, from) => {
  const user = await getUser();
  if (!user && path !== '/login') {
    await router.navigate('/login');
    return false;
  }
  return true;
};

const adminGuard = async (path, from) => {
  const user = await getUser();
  if (!user?.isAdmin) {
    await router.navigate('/dashboard');
    return false;
  }
  return true;
};

// Routes
router.addGlobalGuard(authGuard);

router.define('/', async () => {
  document.getElementById('app').innerHTML = '<h1>Home</h1>';
}, { title: 'Home' });

router.define('/login', async () => {
  document.getElementById('app').innerHTML = '<h1>Login</h1>';
}, { title: 'Login' });

router.define('/dashboard', async () => {
  document.getElementById('app').innerHTML = '<h1>Dashboard</h1>';
}, { title: 'Dashboard' });

router.define('/admin', async () => {
  document.getElementById('app').innerHTML = '<h1>Admin Panel</h1>';
}, {
  title: 'Admin',
  guards: [adminGuard]
});

// Initial navigation
router.navigate(window.location.pathname || '/');` },
  ],
};
