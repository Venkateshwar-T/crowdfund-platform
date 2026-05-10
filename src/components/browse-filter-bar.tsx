
'use client';

import { useState } from 'react';
import { Filter, Search } from 'lucide-react';
import { CustomButton } from './custom-button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

interface BrowseFilterBarProps {
  onSearch: (term: string) => void;
}

export function BrowseFilterBar({ onSearch }: BrowseFilterBarProps) {
  const [localSearch, setLocalSearch] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(localSearch);
  };

  return (
    <div className="sticky top-16 z-30 w-full bg-background/90 backdrop-blur-md border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <form onSubmit={handleSearch} className="flex-1 max-w-md relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search campaign titles..." 
            className="pl-10 h-10 rounded-full border-muted-foreground/20 focus-visible:ring-primary/20"
          />
        </form>

        <Sheet>
          <SheetTrigger asChild>
            <CustomButton variant="outline" size="sm" className="rounded-full gap-2 h-10 px-4">
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </CustomButton>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Campaign Filters</SheetTitle>
            </SheetHeader>
            <div className="py-6">
                <p className="text-sm text-muted-foreground">Filters are powered by the Subgraph engine.</p>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
