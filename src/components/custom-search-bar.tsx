
'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function CustomSearchBar() {
  return (
    <div className="relative w-full max-w-[280px] flex items-center gap-3">
      <Search className="h-5 w-5 text-muted-foreground shrink-0" />
      <div className="w-full">
        <Input
          type="search"
          placeholder="Search fundraisers"
          className="h-9 w-full border-0 border-b border-muted-foreground/20 bg-transparent rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary transition-all placeholder:text-muted-foreground/60"
        />
      </div>
    </div>
  );
}
