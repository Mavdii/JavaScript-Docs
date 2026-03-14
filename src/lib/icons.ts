import type { ElementType } from 'react';
import {
  BookOpen,
  FileCode,
  Plug,
  ChefHat,
  Rocket,
  Compass,
  Bug,
} from 'lucide-react';

/**
 * Map of pillar icon names to their corresponding Lucide icon components.
 * Used across the application for consistent iconography.
 */
export const pillarIconMap: Record<string, ElementType> = {
  BookOpen,
  FileCode,
  Plug,
  ChefHat,
  Rocket,
  Compass,
  Bug,
};

/**
 * Get the icon component for a given pillar icon name.
 * Returns BookOpen as fallback if icon not found.
 */
export function getPillarIcon(iconName: string): ElementType {
  return pillarIconMap[iconName] || BookOpen;
}
