import { Helmet } from 'react-helmet-async';
import { siteConfig } from '@/config/site';

interface SeoProps {
  title: string;
  description: string;
  path?: string;
}

export function Seo({ title, description, path = '/' }: SeoProps) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const canonicalUrl = new URL(normalizedPath, siteConfig.url).toString();
  const documentTitle = `${title} | ${siteConfig.name}`;

  return (
    <Helmet>
      <title>{documentTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={siteConfig.keywords.join(', ')} />
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:title" content={documentTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={documentTitle} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
}
