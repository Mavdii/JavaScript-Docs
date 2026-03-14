import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getPillarConfig } from '@/config/categories';
import { getContentByPillar } from '@/lib/content';
import { resolveSidebarGroups } from '@/lib/navigation';
import { Seo } from '@/components/seo/Seo';
import { cn } from '@/lib/utils';
import type { Pillar } from '@/types/content';

interface PillarLandingProps {
  pillar: Pillar;
}

export default function PillarLanding({ pillar }: PillarLandingProps) {
  const config = getPillarConfig(pillar);
  const sidebar = resolveSidebarGroups(pillar);
  const content = getContentByPillar(pillar);

  if (!config) return null;

  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-12 lg:px-8">
      <Seo title={config.label} description={config.description} path={config.href} />
      {/* Header */}
      <div className="mb-12 max-w-2xl">
        <Badge variant="outline" className={cn('mb-4', config.accentClass)}>
          {config.label}
        </Badge>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{config.label}</h1>
        <p className="mt-3 text-lg text-muted-foreground leading-relaxed">{config.description}</p>
      </div>

      {/* Sections from sidebar config */}
      <div className="space-y-10">
        {sidebar.map((group) => (
          <div key={group.label}>
            <h2 className="mb-4 text-xl font-semibold">{group.label}</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((item) => {
                const entry = content.find((c) => `/${c.slug}` === item.href);
                const commonClasses =
                  'group flex flex-col rounded-lg border p-4 transition-all hover:shadow-sm hover:bg-muted/30';

                if (item.status !== 'available') {
                  return (
                    <div key={item.href} className={`${commonClasses} opacity-80`}>
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{item.label}</h3>
                        <Badge variant="outline" className="text-[10px]">
                          Coming Soon
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                        This topic is planned and will be published in a future update.
                      </p>
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={commonClasses}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium group-hover:text-primary transition-colors">{item.label}</h3>
                      <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1" />
                    </div>
                    {entry && (
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{entry.description}</p>
                    )}
                    {entry && (
                      <div className="mt-2 flex gap-2">
                        <Badge variant="secondary" className="text-[10px] capitalize">{entry.difficulty}</Badge>
                        <span className="text-xs text-muted-foreground">{entry.readingTime} min</span>
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
