import { useParams } from 'react-router-dom';
import { DocsLayout } from '@/components/layout/DocsLayout';
import { ContentActions } from '@/components/content/ContentActions';
import { ContentPageSkeleton } from '@/components/content/ContentPageSkeleton';
import { ContentRenderer } from '@/components/content/ContentRenderer';
import { ContentMeta } from '@/components/content/ContentMeta';
import { MissingContentState } from '@/components/content/MissingContentState';
import { RelatedTopics } from '@/components/content/RelatedTopics';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { PrevNextNav } from '@/components/navigation/PrevNextNav';
import { Seo } from '@/components/seo/Seo';
import { extractHeadings, getContentMetaBySlug } from '@/lib/content';
import { getPrevNextNavigation } from '@/lib/navigation';
import { useContentEntry, useContentPageTracking } from '@/hooks/use-content-page';
import type { ProjectContent } from '@/types/content';
import { Badge } from '@/components/ui/badge';
import { Target, Layers } from 'lucide-react';

export default function ProjectPageView() {
  const { slug } = useParams();
  const fullSlug = `projects/${slug}`;
  const meta = getContentMetaBySlug(fullSlug);
  const { data: content, isLoading } = useContentEntry<ProjectContent>(fullSlug, Boolean(meta));
  const progress = useContentPageTracking(fullSlug, Boolean(meta));

  if (!meta) {
    return (
      <>
        <Seo title="Project Not Found" description="The requested project guide is not available yet." path={fullSlug} />
        <MissingContentState
          pillar="projects"
          title="Project guide not found"
          message="This project guide is not available yet. Try another build walkthrough."
        />
      </>
    );
  }

  const headings = content ? extractHeadings(content.sections) : [];
  const { prev, next } = getPrevNextNavigation(fullSlug);

  return (
    <DocsLayout pillar="projects" headings={headings}>
      <Seo title={meta.title} description={meta.description} path={`/${meta.slug}`} />
      <Breadcrumbs items={[{ label: 'Projects', href: '/projects' }, { label: meta.title }]} />

      {isLoading || !content ? (
        <ContentPageSkeleton />
      ) : (
        <>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{content.title}</h1>
        <p className="mt-3 text-lg text-muted-foreground leading-relaxed">{content.summary}</p>
        <div className="mt-4">
          <ContentMeta difficulty={content.difficulty} readingTime={content.readingTime} tags={content.tags} />
        </div>
      </div>

      <ContentActions slug={content.slug} progress={progress.percent} completed={progress.completed} />

      {content.techStack.length > 0 && (
        <div className="mb-8 rounded-lg border bg-muted/30 p-4">
          <h4 className="mb-2 text-sm font-semibold flex items-center gap-2">
            <Layers className="h-4 w-4 text-accent-reference" />
            Tech Stack
          </h4>
          <div className="flex flex-wrap gap-2">
            {content.techStack.map((t) => (
              <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
            ))}
          </div>
        </div>
      )}

      {content.learningGoals.length > 0 && (
        <div className="mb-8 rounded-lg border bg-accent-learn/5 p-4">
          <h4 className="mb-2 text-sm font-semibold flex items-center gap-2">
            <Target className="h-4 w-4 text-accent-learn" />
            What you'll build
          </h4>
          <ul className="space-y-1">
            {content.learningGoals.map((goal, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent-learn shrink-0" />
                {goal}
              </li>
            ))}
          </ul>
        </div>
      )}

      <ContentRenderer blocks={content.sections} />
      <RelatedTopics contentId={content.id} />
      <PrevNextNav prev={prev} next={next} />
        </>
      )}
    </DocsLayout>
  );
}
