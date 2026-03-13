import { useState } from 'react';
import { Highlight, themes } from 'prism-react-renderer';
import { Check, Copy, FileCode } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  code: string;
  language: string;
  filename?: string;
  highlights?: number[];
}

export function CodeBlock({ code, language, filename, highlights = [] }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isDark = document.documentElement.classList.contains('dark');

  return (
    <div
      className="group relative overflow-hidden rounded-xl border border-border/50 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md animate-in fade-in slide-in-from-bottom-3"
      style={{
        marginTop: '16px',
        marginBottom: '32px',
        borderRadius: '8px',
        background: isDark ? '#1e1e1e' : '#f5f5f5',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/50 px-4 py-2.5 bg-muted/80 backdrop-blur-md">
        <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
          <FileCode className="h-4 w-4 text-primary/70" />
          {filename && <span className="font-medium tracking-wide text-foreground/80">{filename}</span>}
          <span className="rounded-md bg-background/80 px-2 py-0.5 font-mono text-[11px] font-medium tracking-wider uppercase shadow-sm">{language}</span>
        </div>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 rounded-md bg-background/50 px-2.5 py-1 text-xs font-medium text-muted-foreground opacity-0 backdrop-blur-sm transition-all duration-200 hover:bg-background hover:text-foreground group-hover:opacity-100 active:scale-95 shadow-sm"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-emerald-500">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code */}
      <Highlight theme={isDark ? themes.nightOwl : themes.github} code={code.trim()} language={language}>
        {({ tokens, getLineProps, getTokenProps }) => (
          <pre className="overflow-x-auto text-sm leading-relaxed" style={{ padding: '24px' }}>
            {tokens.map((line, i) => (
              <div
                key={i}
                {...getLineProps({ line })}
                className={cn(
                  'px-1',
                  highlights.includes(i + 1) && 'bg-accent-learn/10 -mx-4 px-5 border-l-2 border-accent-learn'
                )}
              >
                <span className="mr-4 inline-block w-6 select-none text-right text-xs text-muted-foreground/40">
                  {i + 1}
                </span>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
}
