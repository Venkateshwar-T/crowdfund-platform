'use client';

import { useState } from 'react';
import { Filter } from 'lucide-react';
import { CustomButton } from './custom-button';
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

const CATEGORIES = [
  { id: 'medical', label: 'Medical' },
  { id: 'environment', label: 'Environment' },
  { id: 'education', label: 'Education' },
  { id: 'animals', label: 'Animals' },
  { id: 'arts', label: 'Arts and Media' },
  { id: 'women', label: 'Women' },
  { id: 'community', label: 'Community' },
  { id: 'technology', label: 'Technology' },
  { id: 'sports', label: 'Sports' },
  { id: 'disaster', label: 'Disaster Relief' },
  { id: 'development', label: 'Development' },
];

export function BrowseFilterBar() {
  const [timeFilter, setTimeFilter] = useState('any');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isAllCategories, setIsAllCategories] = useState(true);

  const handleCategoryToggle = (categoryId: string) => {
    setIsAllCategories(false);
    setSelectedCategories((prev) => {
      const isSelected = prev.includes(categoryId);
      const next = isSelected 
        ? prev.filter((id) => id !== categoryId) 
        : [...prev, categoryId];
      
      if (next.length === 0) {
        setIsAllCategories(true);
      }
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
        <h1 className="text-sm md:text-lg font-semibold text-foreground">
          Browse campaigns
        </h1>

        <Sheet>
          <SheetTrigger asChild>
            <CustomButton variant="outline" size="sm" className="rounded-full gap-2 h-8 md:h-9 px-3 md:px-4 border-muted-foreground/20 hover:bg-primary/5 hover:text-primary transition-all">
              <Filter className="h-3.5 w-3.5 md:h-4 md:w-4" />
              <span className="text-xs md:text-sm font-medium">Filter</span>
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
              <SheetTitle className="text-lg font-bold">Filters</SheetTitle>
            </SheetHeader>
            
            <ScrollArea className="flex-grow">
              <div className="flex flex-col gap-6 p-6 pb-12">
                {/* Time Section */}
                <div className="space-y-4">
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">Time</h3>
                  <RadioGroup 
                    value={timeFilter} 
                    onValueChange={setTimeFilter} 
                    className="flex flex-col gap-3"
                  >
                    {['any', 'newest', 'oldest'].map((val) => (
                      <div key={val} className="flex items-center space-x-3 group cursor-pointer">
                        <RadioGroupItem value={val} id={`time-${val}`} className="border-muted-foreground/30" />
                        <Label htmlFor={`time-${val}`} className="text-sm font-medium cursor-pointer group-hover:text-primary transition-colors capitalize">
                          {val === 'any' ? 'Any time' : `${val} first`}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <Separator className="bg-border/50" />

                {/* Status Section */}
                <div className="space-y-4">
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">Status</h3>
                  <RadioGroup 
                    value={statusFilter} 
                    onValueChange={setStatusFilter} 
                    className="flex flex-col gap-3"
                  >
                    {['all', 'new', 'active', 'completed'].map((val) => (
                      <div key={val} className="flex items-center space-x-3 group cursor-pointer">
                        <RadioGroupItem value={val} id={`status-${val}`} className="border-muted-foreground/30" />
                        <Label htmlFor={`status-${val}`} className="text-sm font-medium cursor-pointer group-hover:text-primary transition-colors capitalize">
                          {val}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <Separator className="bg-border/50" />

                {/* Categories Section */}
                <div className="space-y-4">
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">Categories</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {/* All Categories Option */}
                    <div className="flex items-center space-x-3 group cursor-pointer">
                      <RadioGroup 
                        value={isAllCategories ? "all" : ""} 
                        onValueChange={handleAllCategoriesToggle}
                      >
                        <RadioGroupItem value="all" id="cat-all" className="border-muted-foreground/30" />
                      </RadioGroup>
                      <Label htmlFor="cat-all" className="text-sm font-medium cursor-pointer group-hover:text-primary transition-colors">
                        All Categories
                      </Label>
                    </div>

                    {/* Specific Categories */}
                    <div className="grid grid-cols-1 gap-3 pl-0.5">
                      {CATEGORIES.map((category) => (
                        <div key={category.id} className="flex items-center space-x-3 group cursor-pointer">
                          <Checkbox 
                            id={`cat-${category.id}`} 
                            checked={selectedCategories.includes(category.id)}
                            onCheckedChange={() => handleCategoryToggle(category.id)}
                            className="border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                          />
                          <Label
                            htmlFor={`cat-${category.id}`}
                            className="text-sm font-medium leading-none cursor-pointer group-hover:text-primary transition-colors"
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