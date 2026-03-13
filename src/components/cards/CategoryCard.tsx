import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, FileCode, Plug, ChefHat, Rocket, Compass, Bug } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PillarConfig } from '@/config/categories';

const iconMap: Record<string, React.ElementType> = {
  BookOpen, FileCode, Plug, ChefHat, Rocket, Compass, Bug,
};

interface CategoryCardProps {
  pillar: PillarConfig;
}

export function CategoryCard({ pillar }: CategoryCardProps) {
  const Icon = iconMap[pillar.icon] || BookOpen;

  return (
    <Link
      to={pillar.href}
      className={cn(
        'group relative flex flex-col rounded-xl border p-6 transition-all hover:shadow-md hover:border-border/80',
        pillar.accentBgClass,
      )}
    >
      <div className={cn('mb-4 flex h-10 w-10 items-center justify-center rounded-lg', pillar.accentBgClass)}>
        <Icon className={cn('h-5 w-5', pillar.accentClass)} />
      </div>
      <h3 className="mb-1 text-lg font-semibold">{pillar.label}</h3>
      <p className="mb-4 flex-1 text-sm text-muted-foreground leading-relaxed">{pillar.description}</p>
      <div className="flex items-center gap-1 text-sm font-medium">
        <span className={pillar.accentClass}>Explore</span>
        <ArrowRight className={cn('h-4 w-4 transition-transform group-hover:translate-x-1', pillar.accentClass)} />
      </div>
    </Link>
  );
}
