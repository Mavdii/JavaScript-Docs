import type { RecipeContent } from '@/types/content';

export const darkModeRecipe: RecipeContent = {
  id: 'recipe-dark-mode',
  title: 'Dark Mode Implementation',
  description: 'Implement system-aware dark mode with localStorage persistence and smooth transitions.',
  slug: 'recipes/dark-mode',
  pillar: 'recipes',
  category: 'ui-patterns',
  tags: ['dark-mode', 'theme', 'css', 'localStorage', 'ui'],
  difficulty: 'intermediate',
  contentType: 'recipe',
  summary: 'Implement dark mode that respects system preferences, persists user choice, and provides smooth transitions.',
  relatedTopics: ['css-variables', 'localStorage', 'media-queries'],
  order: 7,
  updatedAt: '2025-06-01',
  readingTime: 10,
  featured: false,
  keywords: ['dark mode', 'theme', 'prefers-color-scheme', 'css variables'],
  problem: 'Users expect dark mode support. You need to detect system preference, allow manual override, persist choice, and handle transitions smoothly.',
  pitfalls: [
    'Not respecting prefers-color-scheme media query',
    'Theme flash on page load before JavaScript runs',
    'Not persisting user choice',
    'Forgetting to update affected images and SVGs in dark mode',
    'Not handling high contrast preferences'
  ],
  variations: ['Auto-detect only', 'Manual toggle only', 'System + manual override', 'Multiple themes'],
  sections: [
    { type: 'heading', level: 2, text: 'System Preference Detection', id: 'system-detection' },
    { type: 'code', language: 'javascript', filename: 'dark-mode-detect.js', code: `// Check system preference
function getSystemTheme() {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

// Listen for system theme changes
const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
darkModeQuery.addEventListener('change', (e) => {
  const newTheme = e.matches ? 'dark' : 'light';
  console.log('System theme changed to:', newTheme);
  applyTheme(newTheme);
});

// Detect other preferences
function getAccessibilityPreferences() {
  return {
    darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    highContrast: window.matchMedia('(prefers-contrast: more)').matches,
    lightText: window.matchMedia('(prefers-color-scheme: light)').matches
  };
}

console.log(getAccessibilityPreferences());` },

    { type: 'heading', level: 2, text: 'CSS-Based Dark Mode', id: 'css-dark-mode' },
    { type: 'code', language: 'css', filename: 'dark-mode.css', code: `/* CSS Variables for theming */
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f5f5f5;
  --text-primary: #1a1a1a;
  --text-secondary: #666666;
  --border-color: #e0e0e0;
  --accent: #007bff;
  --shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Dark mode override */
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #1a1a1a;
    --bg-secondary: #2d2d2d;
    --text-primary: #ffffff;
    --text-secondary: #b0b0b0;
    --border-color: #404040;
    --accent: #4a9eff;
    --shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  }
}

/* Use CSS variables */
body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  transition: background-color 0.3s, color 0.3s;
}

.card {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow);
  padding: 20px;
  border-radius: 8px;
}

.button {
  background-color: var(--accent);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

/* Dark mode with data attribute */
[data-theme="dark"] {
  --bg-primary: #1a1a1a;
  --bg-secondary: #2d2d2d;
  --text-primary: #ffffff;
  --text-secondary: #b0b0b0;
  --border-color: #404040;
}

[data-theme="light"] {
  --bg-primary: #ffffff;
  --bg-secondary: #f5f5f5;
  --text-primary: #1a1a1a;
  --text-secondary: #666666;
  --border-color: #e0e0e0;
}` },

    { type: 'heading', level: 2, text: 'JavaScript Theme Manager', id: 'theme-manager' },
    { type: 'code', language: 'javascript', filename: 'dark-mode-manager.js', code: `class ThemeManager {
  constructor(options = {}) {
    this.storageKey = options.storageKey || 'theme';
    this.defaultTheme = options.defaultTheme || 'auto';
    this.themes = options.themes || ['light', 'dark'];
    this.init();
  }

  init() {
    // Restore saved theme or use system preference
    const saved = this.getSavedTheme();
    const theme = saved || this.getSystemTheme();
    this.setTheme(theme);

    // Listen for system changes
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    darkModeQuery.addEventListener('change', (e) => {
      if (!this.getSavedTheme()) {
        this.setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  getSavedTheme() {
    return localStorage.getItem(this.storageKey);
  }

  setTheme(theme) {
    if (!this.themes.includes(theme)) return;

    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(this.storageKey, theme);

    // Dispatch event
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
  }

  toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    this.setTheme(next);
  }

  getCurrentTheme() {
    return document.documentElement.getAttribute('data-theme') || this.getSystemTheme();
  }

  removeUserPreference() {
    localStorage.removeItem(this.storageKey);
    this.setTheme(this.getSystemTheme());
  }
}

// Usage
const themeManager = new ThemeManager();

// Toggle button
document.getElementById('themeToggle').addEventListener('click', () => {
  themeManager.toggleTheme();
});

// Listen for theme changes
window.addEventListener('themechange', (e) => {
  console.log('Theme changed to:', e.detail.theme);
});` },

    { type: 'heading', level: 2, text: 'Preventing Theme Flash', id: 'prevent-flash' },
    { type: 'code', language: 'html', filename: 'dark-mode-noflash.html', code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Dark Mode</title>
  <style>
    /* Add to <head> to prevent flash */
    :root {
      --bg-primary: #ffffff;
      --text-primary: #1a1a1a;
    }

    @media (prefers-color-scheme: dark) {
      :root {
        --bg-primary: #1a1a1a;
        --text-primary: #ffffff;
      }
    }

    html[data-theme="dark"] {
      --bg-primary: #1a1a1a;
      --text-primary: #ffffff;
    }

    html[data-theme="light"] {
      --bg-primary: #ffffff;
      --text-primary: #1a1a1a;
    }

    body {
      background-color: var(--bg-primary);
      color: var(--text-primary);
      transition: background-color 0.3s, color 0.3s;
    }
  </style>

  <!-- Inline script in HEAD to run before rendering -->
  <script>
    (function() {
      // Get saved theme or system preference
      const saved = localStorage.getItem('theme');
      const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      const theme = saved || system;

      // Apply immediately (before page renders)
      document.documentElement.setAttribute('data-theme', theme);
    })();
  </script>
</head>
<body>
  <div id="app">
    <!-- Content -->
  </div>

  <!-- Rest of scripts -->
  <script src="app.js"></script>
</body>
</html>` },

    { type: 'heading', level: 2, text: 'Handling Images in Dark Mode', id: 'dark-mode-images' },
    { type: 'code', language: 'javascript', filename: 'dark-mode-images.js', code: `// Different images for light/dark mode
class DarkModeImages {
  constructor() {
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    darkModeQuery.addEventListener('change', () => this.updateImages());
    this.updateImages();
  }

  updateImages() {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Update image srcset
    document.querySelectorAll('[data-light-src][data-dark-src]').forEach(img => {
      img.src = isDark ? img.dataset.darkSrc : img.dataset.lightSrc;
    });

    // Update SVG color filter
    document.querySelectorAll('[data-theme-aware]').forEach(svg => {
      if (isDark) {
        svg.style.filter = 'invert(1)';
      } else {
        svg.style.filter = 'none';
      }
    });
  }
}

new DarkModeImages();` },

    { type: 'heading', level: 2, text: 'Advanced: Multiple Themes', id: 'multiple-themes' },
    { type: 'code', language: 'javascript', filename: 'dark-mode-multiple.js', code: `class MultiThemeManager {
  constructor(themes) {
    this.themes = {
      light: {
        '--bg-primary': '#ffffff',
        '--text-primary': '#1a1a1a',
        '--accent': '#007bff'
      },
      dark: {
        '--bg-primary': '#1a1a1a',
        '--text-primary': '#ffffff',
        '--accent': '#4a9eff'
      },
      sepia: {
        '--bg-primary': '#f4eae0',
        '--text-primary': '#5c4033',
        '--accent': '#8b7355'
      }
    };

    Object.assign(this.themes, themes);
    this.init();
  }

  init() {
    const saved = localStorage.getItem('theme') || 'auto';
    this.setTheme(saved);
  }

  setTheme(theme) {
    let themeToApply = theme;

    if (theme === 'auto') {
      themeToApply = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    if (!this.themes[themeToApply]) {
      console.warn('Theme not found:', themeToApply);
      return;
    }

    const variables = this.themes[themeToApply];
    const root = document.documentElement;

    for (const [key, value] of Object.entries(variables)) {
      root.style.setProperty(key, value);
    }

    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', themeToApply);
  }

  getAvailableThemes() {
    return Object.keys(this.themes);
  }
}

// Usage
const themeManager = new MultiThemeManager();

document.querySelectorAll('[data-theme-selector]').forEach(button => {
  button.addEventListener('click', (e) => {
    themeManager.setTheme(e.target.dataset.theme);
  });
});` },

    { type: 'heading', level: 2, text: 'Respecting Reduced Motion', id: 'reduced-motion' },
    { type: 'code', language: 'css', filename: 'dark-mode-motion.css', code: `/* Smooth transition for users who don't prefer reduced motion */
@media (prefers-reduced-motion: no-preference) {
  body {
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  .card {
    transition: box-shadow 0.2s ease, border-color 0.2s ease;
  }
}

/* No transition for users with reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}` },

    { type: 'heading', level: 2, text: 'Complete Implementation Example', id: 'complete-example' },
    { type: 'code', language: 'typescript', filename: 'dark-mode-complete.ts', code: `interface ThemeConfig {
  storageKey: string;
  defaultTheme: 'light' | 'dark' | 'auto';
  themes: Record<string, Record<string, string>>;
}

class ThemeManager {
  private storageKey: string;
  private themes: Record<string, Record<string, string>>;
  private mediaQuery: MediaQueryList;

  constructor(config: ThemeConfig) {
    this.storageKey = config.storageKey;
    this.themes = config.themes;
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.init();
  }

  private init(): void {
    const saved = this.getSavedTheme();
    const theme = saved || this.getSystemTheme();
    this.setTheme(theme);

    this.mediaQuery.addEventListener('change', (e) => {
      if (!this.getSavedTheme()) {
        this.setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  private getSystemTheme(): 'light' | 'dark' {
    return this.mediaQuery.matches ? 'dark' : 'light';
  }

  private getSavedTheme(): string | null {
    return localStorage.getItem(this.storageKey);
  }

  setTheme(theme: string): void {
    if (!this.themes[theme]) {
      console.warn('Theme not found:', theme);
      return;
    }

    const variables = this.themes[theme];
    const root = document.documentElement;

    for (const [key, value] of Object.entries(variables)) {
      root.style.setProperty(key, value);
    }

    localStorage.setItem(this.storageKey, theme);
    document.documentElement.setAttribute('data-theme', theme);

    window.dispatchEvent(
      new CustomEvent('themechange', { detail: { theme } })
    );
  }

  toggleTheme(): void {
    const current = this.getCurrentTheme();
    const themes = Object.keys(this.themes);
    const index = themes.indexOf(current);
    const next = themes[(index + 1) % themes.length];
    this.setTheme(next);
  }

  getCurrentTheme(): string {
    return (
      document.documentElement.getAttribute('data-theme') ||
      this.getSystemTheme()
    );
  }

  resetToSystem(): void {
    localStorage.removeItem(this.storageKey);
    this.setTheme(this.getSystemTheme());
  }
}

export default ThemeManager;` },
  ],
};
