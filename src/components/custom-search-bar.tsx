
'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export function CustomSearchBar() {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative w-full max-w-[280px] flex items-center gap-3">
      <Search className="h-5 w-5 text-muted-foreground shrink-0" />
      <div className="relative w-full">
        <Input
          type="search"
          placeholder="Search fundraisers"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="h-9 w-full border-0 bg-transparent rounded-none px-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/60 shadow-none"
        />
        {/* Baseline - the thin line */}
        <div className="absolute bottom-0 left-0 h-[1px] w-full bg-muted-foreground/20" />
        
        {/* Active Line - grows from left to right */}
        <div 
          className={cn(
            "absolute bottom-0 left-0 h-[2px] bg-primary transition-all duration-300 ease-out",
            isFocused ? "w-full" : "w-0"
          )}
        />
      </div>
    </div>
  );
}
