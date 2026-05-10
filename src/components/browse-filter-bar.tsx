'use client';

import { Filter } from 'lucide-react';
import { CustomButton } from './custom-button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export function BrowseFilterBar() {
  return (
    <div className="sticky top-16 z-30 w-full bg-background/90 backdrop-blur-md border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <h1 className="text-lg md:text-xl font-black text-foreground">
          Browse Campaigns
        </h1>

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
                <div className="mt-4 p-4 rounded-xl bg-muted/50 border border-border/50">
                  <p className="text-xs font-medium italic">Advanced filtering options coming soon.</p>
                </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
