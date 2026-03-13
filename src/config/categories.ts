import type { Pillar } from '@/types/content';

export interface PillarConfig {
  key: Pillar;
  label: string;
  description: string;
  href: string;
  accentClass: string;          // Tailwind text-* class
  accentBgClass: string;        // Tailwind bg-* class (10% opacity variant)
  icon: string;                 // Lucide icon name for mapping
  order: number;
}

export const pillarConfig: PillarConfig[] = [
  {
    key: 'learn',
    label: 'Learn',
    description: 'Structured learning from fundamentals to advanced JavaScript.',
    href: '/learn',
    accentClass: 'text-accent-learn',
    accentBgClass: 'bg-accent-learn/10',
    icon: 'BookOpen',
    order: 1,
  },
  {
    key: 'reference',
    label: 'Reference',
    description: 'Fast, searchable reference for methods, patterns, and APIs.',
    href: '/reference',
    accentClass: 'text-accent-reference',
    accentBgClass: 'bg-accent-reference/10',
    icon: 'FileCode',
    order: 2,
  },
  {
    key: 'integrations',
    label: 'Integrations',
    description: 'Practical guides for JavaScript with external services and APIs.',
    href: '/integrations',
    accentClass: 'text-accent-integrations',
    accentBgClass: 'bg-accent-integrations/10',
    icon: 'Plug',
    order: 3,
  },
  {
    key: 'recipes',
    label: 'Recipes',
    description: 'Engineering recipes for common real-world implementation problems.',
    href: '/recipes',
    accentClass: 'text-accent-recipes',
    accentBgClass: 'bg-accent-recipes/10',
    icon: 'ChefHat',
    order: 4,
  },
  {
    key: 'projects',
    label: 'Projects',
    description: 'Build real-world applications with JavaScript.',
    href: '/projects',
    accentClass: 'text-accent-projects',
    accentBgClass: 'bg-accent-projects/10',
    icon: 'Rocket',
    order: 5,
  },
  {
    key: 'explore',
    label: 'Explore',
    description: 'Directories, glossary, comparisons, and discovery tools.',
    href: '/explore',
    accentClass: 'text-accent-explore',
    accentBgClass: 'bg-accent-explore/10',
    icon: 'Compass',
    order: 6,
  },
  {
    key: 'errors',
    label: 'Errors',
    description: 'Common mistakes, debugging guides, and troubleshooting.',
    href: '/errors',
    accentClass: 'text-accent-errors',
    accentBgClass: 'bg-accent-errors/10',
    icon: 'Bug',
    order: 7,
  },
];

export function getPillarConfig(key: Pillar): PillarConfig | undefined {
  return pillarConfig.find((p) => p.key === key);
}
