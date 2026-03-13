import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface PrevNextNavProps {
  prev?: { label: string; href: string };
  next?: { label: string; href: string };
}

export function PrevNextNav({ prev, next }: PrevNextNavProps) {
  if (!prev && !next) return null;

  return (
    <div className="mt-12 flex items-stretch gap-4 border-t pt-6">
      {prev ? (
        <Link
          to={prev.href}
          className="group flex flex-1 items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50"
        >
          <ArrowLeft className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-x-1" />
          <div>
            <p className="text-xs text-muted-foreground">Previous</p>
            <p className="text-sm font-medium">{prev.label}</p>
          </div>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
      {next ? (
        <Link
          to={next.href}
          className="group flex flex-1 items-center justify-end gap-3 rounded-lg border p-4 text-right transition-colors hover:bg-muted/50"
        >
          <div>
            <p className="text-xs text-muted-foreground">Next</p>
            <p className="text-sm font-medium">{next.label}</p>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </div>
  );
}
