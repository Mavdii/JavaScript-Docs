import { Link } from 'react-router-dom';
import { Menu, Search } from 'lucide-react';
import { useState } from 'react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { resolveTopNavigation } from '@/lib/navigation';

interface NavbarProps {
  onOpenSearch: () => void;
}

export function Navbar({ onOpenSearch }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigation = resolveTopNavigation();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-screen-2xl items-center px-4 lg:px-8">
        {/* Logo */}
        <Link to="/" className="mr-8 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-bold">
            JS
          </div>
          <span className="text-lg font-bold tracking-tight">JSphere</span>
        </Link>

        {/* Desktop Nav */}
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList>
            {navigation.map((section) => (
              <NavigationMenuItem key={section.label}>
                <NavigationMenuTrigger className="text-sm">{section.label}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div
                    className={
                      section.label === 'Learn'
                        ? 'grid gap-4 p-6 grid-cols-4 w-[900px]'
                        : section.label === 'Reference'
                        ? 'grid gap-4 p-6 grid-cols-3 w-[700px]'
                        : 'grid w-[500px] gap-4 p-6 lg:w-[600px] lg:grid-cols-2'
                    }
                  >
                    {section.groups.map((group) => (
                      <div key={group.label}>
                        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          {group.label}
                        </h4>
                        <ul className="space-y-1">
                          {group.items.map((item) => (
                            <li key={item.href}>
                              {item.status === 'available' ? (
                                <NavigationMenuLink asChild>
                                  <Link
                                    to={item.href}
                                    className="flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
                                  >
                                    {item.label}
                                  </Link>
                                </NavigationMenuLink>
                              ) : (
                                <div className="flex items-center justify-between rounded-md px-3 py-2 text-sm opacity-70">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">{item.label}</span>
                                    <Badge variant="outline" className="text-[10px]">
                                      Coming Soon
                                    </Badge>
                                  </div>
                                </div>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right */}
        <div className="ml-auto flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenSearch}
            className="hidden gap-2 text-sm text-muted-foreground sm:flex"
          >
            <Search className="h-4 w-4" />
            <span>Search...</span>
            <kbd className="pointer-events-none ml-2 hidden rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground sm:inline-block">
              ⌘K
            </kbd>
          </Button>
          <Button variant="ghost" size="icon" className="sm:hidden h-9 w-9" onClick={onOpenSearch}>
            <Search className="h-4 w-4" />
          </Button>
          <ThemeToggle />

          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 overflow-y-auto">
              <div className="flex items-center gap-2 pb-6 pt-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-bold">
                  JS
                </div>
                <span className="text-lg font-bold">JSphere</span>
              </div>
              <nav className="space-y-1">
                {navigation.map((section) => (
                  <Collapsible key={section.label}>
                    <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-accent">
                      {section.label}
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="ml-3 space-y-1 border-l pl-3 pt-1">
                        {section.groups.map((group) => (
                          <div key={group.label} className="py-1">
                            <p className="mb-1 px-3 text-xs font-medium uppercase text-muted-foreground">
                              {group.label}
                            </p>
                            {group.items.map((item) => (
                              item.status === 'available' ? (
                                <Link
                                  key={item.href}
                                  to={item.href}
                                  onClick={() => setMobileOpen(false)}
                                  className="block rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground"
                                >
                                  {item.label}
                                </Link>
                              ) : (
                                <div
                                  key={item.href}
                                  className="flex items-center justify-between rounded-md px-3 py-1.5 text-sm text-muted-foreground opacity-70"
                                >
                                  <span>{item.label}</span>
                                  <Badge variant="outline" className="text-[10px]">
                                    Soon
                                  </Badge>
                                </div>
                              )
                            ))}
                          </div>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
