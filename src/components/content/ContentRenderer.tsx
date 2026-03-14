import { useMemo, memo } from 'react';
import type { ContentBlock } from '@/types/content';
import { CodeBlock } from '@/components/code/CodeBlock';
import { Callout } from '@/components/content/Callout';
import { cn } from '@/lib/utils';

interface ContentRendererProps {
  blocks: ContentBlock[];
}

function InlineCode({ text }: { text: string }) {
  // Parse backtick-wrapped segments as inline code
  const parts = text.split(/(`[^`]+`)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('`') && part.endsWith('`') ? (
          <code key={i} className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono text-foreground">
            {part.slice(1, -1)}
          </code>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

export const ContentRenderer = memo(function ContentRenderer({ blocks }: ContentRendererProps) {
  // Group blocks into concept sections separated by h2 headings
  // Each h2 starts a new section; we render dividers between sections
  const sections = useMemo(() => {
    const sections: ContentBlock[][] = [];
    let current: ContentBlock[] = [];

    for (const block of blocks) {
      if (block.type === 'heading' && block.level === 2 && current.length > 0) {
        sections.push(current);
        current = [block];
      } else {
        current.push(block);
      }
    }
    if (current.length > 0) sections.push(current);
    
    return sections;
  }, [blocks]);

  function renderBlock(block: ContentBlock, i: number) {
    switch (block.type) {
      case 'heading': {
        const Tag = `h${block.level}` as 'h2' | 'h3' | 'h4';
        return (
          <Tag
            key={i}
            id={block.id}
            className={cn(
              'scroll-mt-20 font-bold tracking-tight text-foreground transition-all duration-300 animate-in fade-in slide-in-from-bottom-2',
              block.level === 2 && 'mt-0 mb-4 text-3xl md:text-4xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent',
              block.level === 3 && 'mt-10 mb-4 text-2xl md:text-3xl',
              block.level === 4 && 'mt-6 mb-4 text-xl md:text-2xl'
            )}
          >
            {block.text}
          </Tag>
        );
      }
      case 'paragraph':
        return (
          <p
            key={i}
            className="mb-3 leading-[1.8] text-muted-foreground/90 text-base md:text-lg animate-in fade-in slide-in-from-bottom-2"
            style={{ marginBottom: '12px' }}
          >
            <InlineCode text={block.text} />
          </p>
        );
      case 'code':
        return (
          <CodeBlock
            key={i}
            code={block.code}
            language={block.language}
            filename={block.filename}
            highlights={block.highlights}
          />
        );
      case 'list': {
        const ListTag = block.ordered ? 'ol' : 'ul';
        return (
          <ListTag
            key={i}
            className={cn(
              'my-4 space-y-3 pl-6 text-muted-foreground/90 text-base md:text-lg animate-in fade-in slide-in-from-bottom-2',
              block.ordered ? 'list-decimal' : 'list-disc'
            )}
          >
            {block.items.map((item, j) => (
              <li key={j} className="leading-[1.8]">
                <InlineCode text={item} />
              </li>
            ))}
          </ListTag>
        );
      }
      case 'callout':
        return <Callout key={i} variant={block.variant} title={block.title} text={block.text} />;
      case 'table':
        return (
          <div key={i} className="my-6 overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  {block.headers.map((h, j) => (
                    <th key={j} className="px-4 py-3 text-left font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, j) => (
                  <tr key={j} className="border-b last:border-0">
                    {row.map((cell, k) => (
                      <td key={k} className="px-4 py-3 text-muted-foreground">
                        <InlineCode text={cell} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div className="docs-content">
      {sections.map((section, sIdx) => (
        <div key={sIdx}>
          {/* Divider between concept sections (not before the first) */}
          {sIdx > 0 && (
            <hr className="docs-section-divider" />
          )}
          {/* Concept section block */}
          <div className="docs-section">
            {section.map((block, i) => renderBlock(block, i))}
          </div>
        </div>
      ))}
    </div>
  );
});
