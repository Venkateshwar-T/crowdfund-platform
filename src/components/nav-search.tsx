'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowLeft, Loader2, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useLazyQuery, gql } from '@apollo/client';
import { CustomSearchBar } from './custom-search-bar';
import { CAMPAIGN_CATEGORIES } from '@/lib/constants';

// --- FIXED QUERY: Use the Searchable String fields ---
const SEARCH_SUGGESTIONS = gql`
  query SearchSuggestions($q: String!) {
    campaigns(
      first: 5, 
      where: { 
        or: [
          { titleSearch_contains_nocase: $q },
          { categorySearch_contains_nocase: $q }
        ]
      }
    ) {
      id
      slug
      titleSearch    # String field from Subgraph
      categorySearch # String field from Subgraph
    }
  }
`;

export function NavSearch({ isSearching, setIsSearching, placeholder, mode = 'overlay' }: any) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [fetchSuggestions, { data, loading }] = useLazyQuery(SEARCH_SUGGESTIONS);

  useEffect(() => {
    if (isSearching && searchInputRef.current) searchInputRef.current.focus();
  }, [isSearching]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (isSearching && searchQuery.length >= 2) {
        fetchSuggestions({ variables: { q: searchQuery } });
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, fetchSuggestions, isSearching]);

  const handleSearchSubmit = (e: any) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/browse?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearching(false);
      setSearchQuery('');
    }
  };

  if (mode === 'trigger') {
    return <CustomSearchBar placeholder={placeholder || "Search campaigns"} onClick={() => setIsSearching(true)} />;
  }

  if (!isSearching) return null;

  return (
    <div className={cn(
      "absolute inset-0 flex items-center px-4 md:px-6 bg-background z-[60] transition-all",
      isSearching ? "opacity-100" : "opacity-0 pointer-events-none"
    )}>
      <button onClick={() => { setIsSearching(false); setSearchQuery(''); }} className="p-2 hover:bg-accent rounded-full">
        <ArrowLeft className="h-5 w-5 text-muted-foreground" />
      </button>
      
      <div className="flex-1 relative mx-4">
        <form onSubmit={handleSearchSubmit}>
          <Input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search title or category..."
            className="h-10 md:h-12 w-full border-0 bg-transparent rounded-none px-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm md:text-base placeholder:text-muted-foreground/40 shadow-none"
          />
        </form>
        <div className="absolute bottom-0 h-[2px] w-full bg-primary rounded-full" />
        
        {searchQuery.length >= 2 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-2xl shadow-2xl border overflow-hidden z-[100]">
            <div className="p-2">
              <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 border-b mb-1">Suggestions</div>
              
              {loading ? (
                <div className="flex items-center gap-3 px-4 py-3">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span className="text-xs text-muted-foreground">Searching...</span>
                </div>
              ) : data?.campaigns?.length > 0 ? (
                <div className="flex flex-col gap-0.5">
                  {data.campaigns.map((c: any) => {
                    // Match the lowercase ID from Subgraph to your Constants for the Label
                    const categoryObj = CAMPAIGN_CATEGORIES.find(cat => cat.id === c.categorySearch.toLowerCase());
                    const displayCategory = categoryObj ? categoryObj.label : c.categorySearch;

                    return (
                      <Link
                        key={c.id}
                        href={`/browse/${c.slug}`}
                        onClick={() => { setIsSearching(false); setSearchQuery(''); }}
                        className="flex flex-col px-4 py-2.5 rounded-xl hover:bg-primary/5 group"
                      >
                        <span className="text-sm font-bold text-foreground group-hover:text-primary truncate">{c.titleSearch}</span>
                        <span className="text-[10px] text-muted-foreground uppercase font-black">{displayCategory}</span>
                      </Link>
                    );
                  })}
                  <Link href={`/browse?q=${searchQuery}`} onClick={() => setIsSearching(false)} className="mt-1 flex items-center justify-center py-2 text-xs font-bold text-primary bg-primary/5 rounded-xl">
                    See all results for "{searchQuery}" <ChevronRight className="h-3 w-3 ml-1" />
                  </Link>
                </div>
              ) : (
                <div className="px-4 py-3 text-xs text-muted-foreground italic">No matches found</div>
              )}
            </div>
          </div>
        )}
      </div>
      <Search className="h-5 w-5 text-primary" />
    </div>
  );
}