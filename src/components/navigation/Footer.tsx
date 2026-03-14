import { Link } from 'react-router-dom';

const footerLinks = [
  {
    title: 'Learn',
    links: [
      { label: 'Fundamentals', href: '/learn' },
      { label: 'Advanced JavaScript', href: '/learn' },
      { label: 'Async Programming', href: '/learn' },
      { label: 'Browser APIs', href: '/learn' },
    ],
  },
  {
    title: 'Reference',
    links: [
      { label: 'Array Methods', href: '/reference' },
      { label: 'String Methods', href: '/reference' },
      { label: 'Object Methods', href: '/reference' },
    ],
  },
  {
    title: 'Build',
    links: [
      { label: 'Integrations', href: '/integrations' },
      { label: 'Recipes', href: '/recipes' },
      { label: 'Projects', href: '/projects' },
    ],
  },
  {
    title: 'Explore',
    links: [
      { label: 'Libraries', href: '/explore' },
      { label: 'Glossary', href: '/explore' },
      { label: 'Common Errors', href: '/errors' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-screen-2xl px-4 py-12 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="mb-3 text-sm font-semibold">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex items-center justify-between border-t pt-6">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground text-[10px] font-bold">
              JS
            </div>
            <span className="text-sm font-semibold">JSphere</span>
          </div>

          <p className="text-xs text-muted-foreground font-mono">
            {'<'} Coded by dev{' '}
            <a
              href="https://t.me/winnr0"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary underline-offset-4 transition-all hover:underline hover:text-primary/80"
            >
              Umar
            </a>
            {' />'}
          </p>

          <p className="text-xs text-muted-foreground">
            The JavaScript Engineering Knowledge System
          </p>
        </div>
      </div>
    </footer>
  );
}
