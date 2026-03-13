import { Link, useLocation } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronRight } from 'lucide-react';
import { resolveSidebarGroups } from '@/lib/navigation';
import type { Pillar } from '@/types/content';

interface DocsSidebarProps {
  pillar: string;
}

export function DocsSidebar({ pillar }: DocsSidebarProps) {
  const location = useLocation();
  const groups = resolveSidebarGroups(pillar as Pillar);

  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <div className="sticky top-[3.75rem] max-h-[calc(100vh-3.75rem)] overflow-y-auto py-6 pr-4">
        <nav className="space-y-1">
          {groups.map((group) => {
            const isGroupActive = group.items.some((item) => location.pathname === item.href);
            return (
              <Collapsible key={group.label} defaultOpen={group.defaultOpen || isGroupActive}>
                <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-semibold hover:bg-accent transition-colors">
                  <span>{group.label}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform duration-200 [[data-state=open]>&]:rotate-90" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <ul className="ml-3 space-y-0.5 border-l py-1 pl-3">
                    {group.items.map((item) => {
                      const active = item.status === 'available' && location.pathname === item.href;
                      return (
                        <li key={item.href}>
                          {item.status === 'available' ? (
                            <Link
                              to={item.href}
                              className={cn(
                                'block rounded-md px-3 py-1.5 text-sm transition-colors',
                                active
                                  ? 'bg-accent font-medium text-foreground'
                                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                              )}
                            >
                              {item.label}
                            </Link>
                          ) : (
                            <div className="flex items-center justify-between rounded-md px-3 py-1.5 text-sm text-muted-foreground opacity-70">
                              <span>{item.label}</span>
                              <Badge variant="outline" className="text-[10px]">
                                Soon
                              </Badge>
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
