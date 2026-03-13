import { Info, AlertTriangle, Lightbulb, AlertOctagon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CalloutVariant } from '@/types/content';

const variants: Record<CalloutVariant, { icon: React.ElementType; border: string; bg: string; iconColor: string }> = {
  info: { icon: Info, border: 'border-accent-learn', bg: 'bg-accent-learn/5', iconColor: 'text-accent-learn' },
  tip: { icon: Lightbulb, border: 'border-accent-reference', bg: 'bg-accent-reference/5', iconColor: 'text-accent-reference' },
  warning: { icon: AlertTriangle, border: 'border-accent-integrations', bg: 'bg-accent-integrations/5', iconColor: 'text-accent-integrations' },
  danger: { icon: AlertOctagon, border: 'border-accent-errors', bg: 'bg-accent-errors/5', iconColor: 'text-accent-errors' },
};

interface CalloutProps {
  variant: CalloutVariant;
  title?: string;
  text: string;
}

export function Callout({ variant, title, text }: CalloutProps) {
  const v = variants[variant];
  const Icon = v.icon;

  return (
    <div className={cn('my-4 rounded-lg border-l-4 p-4', v.border, v.bg)}>
      <div className="flex gap-3">
        <Icon className={cn('mt-0.5 h-5 w-5 shrink-0', v.iconColor)} />
        <div className="min-w-0">
          {title && <p className="mb-1 font-semibold text-sm">{title}</p>}
          <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
        </div>
      </div>
    </div>
  );
}
