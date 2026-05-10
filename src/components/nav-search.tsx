'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowLeft, Loader2, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useLazyQuery, gql } from '@apollo/client';
import { CustomSearchBar } from './custom-search-bar';

const SEARCH_SUGGESTIONS = gql`
  query SearchSuggestions($q: String!) {
    campaigns(
      first: 5, 
      where: { 
        or: [
          { title_contains_nocase: $q },
          { category_contains_nocase: $q }
        ]
      }
    ) {
      id
      title
      category
    }
  }
`;

interface NavSearchProps {
  isSearching: boolean;
  setIsSearching: (val: boolean) => void;
  placeholder?: string;
}

export function NavSearch({ isSearching, setIsSearching, placeholder }: NavSearchProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const [fetchSuggestions, { data, loading }] = useLazyQuery(SEARCH_SUGGESTIONS);

  useEffect(() => {
    if (isSearching && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearching]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.length >= 2) {
        fetchSuggestions({ variables: { q: searchQuery } });
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, fetchSuggestions]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
        // Suggestions remain open while search is active, or close on blur
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent | React.KeyboardEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/browse?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearching(false);
      setSearchQuery('');
    }
  };

  if (!isSearching) {
    return (
      <CustomSearchBar 
        placeholder={placeholder || "Search fundraisers"} 
        onClick={() => setIsSearching(true)} 
      />
    );
  }

  return (
    <div className={cn(
      "absolute inset-0 flex items-center px-4 md:px-6 transition-all duration-500 ease-in-out bg-background z-[60]",
      isSearching ? "opacity-100 translate-y-0" : "opacity-0 pointer-events-none translate-y-2"
    )}>
      <button 
        onClick={() => {
          setIsSearching(false);
          setSearchQuery('');
        }}
        className="p-2 -ml-2 hover:bg-accent rounded-full transition-colors"
        aria-label="Back"
      >
        <ArrowLeft className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
      </button>
      
      <div className="flex-1 relative mx-4">
        <form onSubmit={handleSearchSubmit}>
          <Input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title or category..."
            className="h-10 md:h-12 w-full border-0 bg-transparent rounded-none px-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm md:text-base placeholder:text-muted-foreground/40 shadow-none"
            onKeyDown={(e) => {
              if (e.key === 'Escape') setIsSearching(false);
            }}
          />
        </form>
        <div className="absolute bottom-0 left-0 h-[2px] w-full bg-primary rounded-full" />
        
        {/* Search Suggestions */}
        {searchQuery.length >= 2 && (
          <div 
            ref={suggestionsRef}
            className="absolute top-full left-0 right-0 mt-1 bg-white rounded-2xl shadow-2xl border border-border overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200"
          >
            <div className="p-2">
              <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 border-b mb-1">
                Suggestions
              </div>
              {loading ? (
                <div className="flex items-center gap-3 px-4 py-3">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span className="text-xs text-muted-foreground">Searching the graph...</span>
                </div>
              ) : data?.campaigns?.length > 0 ? (
                <div className="flex flex-col gap-0.5">
                  {data.campaigns.map((c: any) => (
                    <Link
                      key={c.id}
                      href={`/browse/${c.id}`}
                      onClick={() => setIsSearching(false)}
                      className="flex flex-col px-4 py-2.5 rounded-xl hover:bg-primary/5 transition-colors group"
                    >
                      <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">{c.title}</span>
                      <span className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter">{c.category}</span>
                    </Link>
                  ))}
                  <Link 
                    href={`/browse?q=${searchQuery}`}
                    onClick={() => setIsSearching(false)}
                    className="mt-1 flex items-center justify-center gap-2 py-2 text-xs font-bold text-primary bg-primary/5 hover:bg-primary/10 rounded-xl transition-all"
                  >
                    See all results for "{searchQuery}"
                    <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
              ) : (
                <div className="px-4 py-3 text-xs text-muted-foreground italic">
                  No matches found
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <Search className="h-4 w-4 md:h-5 md:w-5 text-primary shrink-0" />
    </div>
  );
}
