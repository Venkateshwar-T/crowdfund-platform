
'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function CustomSearchBar() {
  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search projects..."
        className="pl-10 h-9 bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary/50"
      />
    </div>
  );
}
