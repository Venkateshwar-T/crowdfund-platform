'use client';

import { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';
import { CustomButton } from '@/components/shared/custom-button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { CAMPAIGN_CATEGORIES } from '@/lib/constants';

export interface FilterState {
  time: string;
  status: string;
  categories: string[];
}

interface BrowseFilterBarProps {
  onFilterChange?: (filters: FilterState) => void;
}

export function BrowseFilterBar({ onFilterChange }: BrowseFilterBarProps) {
  const [timeFilter, setTimeFilter] = useState('any');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isAllCategories, setIsAllCategories] = useState(true);

  useEffect(() => {
    onFilterChange?.({
      time: timeFilter,
      status: statusFilter,
      categories: selectedCategories,
    });
  }, [timeFilter, statusFilter, selectedCategories, onFilterChange]);

  const handleCategoryToggle = (categoryId: string) => {
    setIsAllCategories(false);
    setSelectedCategories((prev) => {
      const isSelected = prev.includes(categoryId);
      const next = isSelected 
        ? prev.filter((id) => id !== categoryId) 
        : [...prev, categoryId];
      if (next.length === 0) setIsAllCategories(true);
      return next;
    });
  };

  const handleAllCategoriesToggle = () => {
    setIsAllCategories(true);
    setSelectedCategories([]);
  };

  return (
    <div className="sticky top-16 z-30 w-full bg-background/90 backdrop-blur-md border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-11 md:h-14 flex items-center justify-between">
        <h1 className="text-sm md:text-lg font-black text-foreground uppercase tracking-tight">
          Browse Campaigns
        </h1>

        <Sheet>
          <SheetTrigger asChild>
            <CustomButton variant="outline" size="sm" className="rounded-full gap-2 h-8 md:h-9 px-3 md:px-4 border-muted-foreground/20 hover:bg-primary/5 hover:text-primary transition-all">
              <Filter className="h-3.5 w-3.5 md:h-4 md:w-4" />
              <span className="text-xs md:text-sm font-bold uppercase tracking-wider">Filter</span>
            </CustomButton>
          </SheetTrigger>
          <SheetContent 
            className="w-[75vw] sm:max-w-xs flex flex-col h-full p-0 gap-0 border-l border-border/50"
            style={{
              background: `radial-gradient(circle at top left, hsl(var(--secondary) / 0.4), transparent),
                          radial-gradient(circle at bottom right, hsl(var(--accent) / 0.5), transparent),
                          hsl(var(--background))`
            }}
          >
            <SheetHeader className="p-6 text-left border-b bg-background/50 backdrop-blur-sm">
              <SheetTitle className="text-lg font-black uppercase tracking-tight">Filters</SheetTitle>
            </SheetHeader>
            
            <ScrollArea className="flex-grow">
              <div className="flex flex-col gap-6 p-6 pb-12">
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70">Sort By</h3>
                  <RadioGroup value={timeFilter} onValueChange={setTimeFilter} className="flex flex-col gap-3">
                    {[
                      { value: 'any', label: 'Default' },
                      { value: 'newest', label: 'Deadline (Furthest First)' },
                      { value: 'oldest', label: 'Deadline (Closest First)' }
                    ].map((item) => (
                      <div key={item.value} className="flex items-center space-x-3 group cursor-pointer">
                        <RadioGroupItem value={item.value} id={`time-${item.value}`} className="border-muted-foreground/30" />
                        <Label htmlFor={`time-${item.value}`} className="text-sm font-bold cursor-pointer group-hover:text-primary transition-colors">
                          {item.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <Separator className="bg-border/50" />

                <div className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70">Campaign Status</h3>
                  <RadioGroup value={statusFilter} onValueChange={setStatusFilter} className="flex flex-col gap-3">
                    {['all', 'Active', 'Successful', 'Failed'].map((val) => (
                      <div key={val} className="flex items-center space-x-3 group cursor-pointer">
                        <RadioGroupItem value={val} id={`status-${val}`} className="border-muted-foreground/30" />
                        <Label htmlFor={`status-${val}`} className="text-sm font-bold cursor-pointer group-hover:text-primary transition-colors capitalize">
                          {val}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <Separator className="bg-border/50" />

                <div className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70">Domains</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center space-x-3 group cursor-pointer">
                      <Checkbox 
                        id="cat-all" 
                        checked={isAllCategories}
                        onCheckedChange={handleAllCategoriesToggle}
                        className="border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <Label htmlFor="cat-all" className="text-sm font-bold cursor-pointer group-hover:text-primary transition-colors">
                        All Categories
                      </Label>
                    </div>
                    <div className="grid grid-cols-1 gap-3 pl-0.5">
                      {CAMPAIGN_CATEGORIES.map((category) => (
                        <div key={category.id} className="flex items-center space-x-3 group cursor-pointer">
                          <Checkbox 
                            id={`cat-${category.id}`} 
                            checked={selectedCategories.includes(category.id)}
                            onCheckedChange={() => handleCategoryToggle(category.id)}
                            className="border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                          />
                          <Label
                            htmlFor={`cat-${category.id}`}
                            className="text-sm font-bold leading-none cursor-pointer group-hover:text-primary transition-colors"
                          >
                            {category.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}