import { useState, type ElementType } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { searchContent, getSearchSuggestions, groupResultsByType } from '@/lib/search';
import { Badge } from '@/components/ui/badge';
import { addRecentSearch } from '@/lib/user-library';
import { useUserLibrary } from '@/hooks/use-user-library';
import { BookOpen, Bug, ChefHat, Compass, FileCode, Plug, Rocket, Search } from 'lucide-react';

const typeIcons: Record<string, ElementType> = {
  lesson: BookOpen,
  reference: FileCode,
  recipe: ChefHat,
  integration: Plug,
  project: Rocket,
  'error-guide': Bug,
  library: Compass,
  glossary: Compass,
  comparison: Compass,
};

const typeLabels: Record<string, string> = {
  lesson: 'Lessons',
  reference: 'Reference',
  recipe: 'Recipes',
  integration: 'Integrations',
  project: 'Projects',
  'error-guide': 'Errors',
  library: 'Libraries',
  glossary: 'Glossary',
  comparison: 'Comparisons',
};

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const library = useUserLibrary();

  const results = searchContent(query);
  const grouped = groupResultsByType(results);
  const suggestions = getSearchSuggestions();
  const recentSearches = library.recentSearches;

  const handleSelect = (slug: string) => {
    if (query.trim()) addRecentSearch(query);
    navigate(`/${slug}`);
    onOpenChange(false);
    setQuery('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 gap-0 max-w-lg overflow-hidden">
        <Command shouldFilter={false} className="rounded-lg">
          <CommandInput
            placeholder="Search documentation..."
            value={query}
            onValueChange={setQuery}
          />
          <CommandList className="max-h-80">
            {query && results.length === 0 && (
              <CommandEmpty>No results found for "{query}"</CommandEmpty>
            )}
            {query
              ? Object.entries(grouped).map(([type, items]) => (
                  <CommandGroup key={type} heading={typeLabels[type] || type}>
                    {items.map(({ entry }) => {
                      const Icon = typeIcons[entry.contentType] || FileCode;
                      return (
                        <CommandItem
                          key={entry.id}
                          value={entry.id}
                          onSelect={() => handleSelect(entry.slug)}
                          className="gap-3"
                        >
                          <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-medium text-sm">{entry.title}</p>
                            <p className="truncate text-xs text-muted-foreground">{entry.description}</p>
                          </div>
                          <div className="flex shrink-0 items-center gap-2">
                            <Badge variant="secondary" className="text-[10px] capitalize">
                              {entry.contentType.replace('-', ' ')}
                            </Badge>
                            <Badge variant="outline" className="text-[10px] capitalize">
                              {entry.pillar}
                            </Badge>
                          </div>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                ))
              : suggestions.length > 0 && (
                  <>
                    {recentSearches.length > 0 && (
                      <CommandGroup heading="Recent Searches">
                        {recentSearches.map((recentQuery) => (
                          <CommandItem
                            key={recentQuery}
                            value={`recent-${recentQuery}`}
                            onSelect={() => setQuery(recentQuery)}
                            className="gap-3"
                          >
                            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                            <span className="text-sm">{recentQuery}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}

                    <CommandGroup heading="Popular">
                      {suggestions.map((entry) => {
                        const Icon = typeIcons[entry.contentType] || FileCode;
                        return (
                          <CommandItem
                            key={entry.id}
                            value={entry.id}
                            onSelect={() => handleSelect(entry.slug)}
                            className="gap-3"
                          >
                            <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                            <div className="min-w-0 flex-1">
                              <span className="block truncate text-sm font-medium">{entry.title}</span>
                              <span className="block truncate text-xs text-muted-foreground">{entry.description}</span>
                            </div>
                            <Badge variant="outline" className="text-[10px] capitalize">
                              {entry.pillar}
                            </Badge>
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </>
                )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
