import type { ReactNode } from 'react';
import { DocsSidebar } from '@/components/navigation/DocsSidebar';
import { TableOfContents } from '@/components/navigation/TableOfContents';
import type { HeadingInfo } from '@/types/content';

interface DocsLayoutProps {
  pillar: string;
  headings: HeadingInfo[];
  children: ReactNode;
}

export function DocsLayout({ pillar, headings, children }: DocsLayoutProps) {
  return (
    <div className="mx-auto flex max-w-screen-2xl px-4 lg:px-8">
      <DocsSidebar pillar={pillar} />
      {/* Main content: desktop 32px 48px padding, mobile 16px 20px */}
      <main className="min-w-0 flex-1 py-8 docs-main-content">
        <div className="mx-auto max-w-3xl">
          {children}
        </div>
      </main>
      <TableOfContents headings={headings} />
    </div>
  );
}
