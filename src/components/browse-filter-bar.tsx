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
  { id: 'elderly', label: 'Elderly' },
  { id: 'technology', label: 'Technology' },
  { id: 'sports', label: 'Sports' },
  { id: 'disaster', label: 'Disaster Relief' },
  { id: 'development', label: 'Urban/Rural Development' },
];

export function BrowseFilterBar() {
  return (
    <div className="sticky top-16 z-30 w-full bg-background/95 backdrop-blur-sm border-b">
      <div className="max-w-7xl mx-auto px-4 h-14 md:h-16 flex items-center justify-between">
        <h1 className="text-lg md:text-2xl font-bold text-foreground">
          Browse campaigns
        </h1>

        <Sheet>
          <SheetTrigger asChild>
            <CustomButton variant="outline" size="sm" className="rounded-full gap-2 h-8 md:h-10">
              <Filter className="h-3.5 w-3.5 md:h-4 md:w-4" />
              <span className="text-xs md:text-sm">Filter</span>
            </CustomButton>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-md flex flex-col h-full">
            <SheetHeader className="px-1 text-left">
              <SheetTitle className="text-xl md:text-2xl font-bold">Filters</SheetTitle>
            </SheetHeader>
            
            <ScrollArea className="flex-grow pr-4 -mr-4 mt-6">
              <div className="flex flex-col gap-6 pb-8">
                {/* Time Section */}
                <div className="flex flex-col gap-4">
                  <h3 className="font-bold text-base md:text-lg">Time</h3>
                  <RadioGroup defaultValue="any" className="flex flex-col gap-3">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="any" id="time-any" />
                      <Label htmlFor="time-any" className="text-sm font-medium">Any</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="newest" id="time-newest" />
                      <Label htmlFor="time-newest" className="text-sm font-medium">Newest First</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="oldest" id="time-oldest" />
                      <Label htmlFor="time-oldest" className="text-sm font-medium">Oldest First</Label>
                    </div>
                  </RadioGroup>
                </div>

                <Separator />

                {/* Status Section */}
                <div className="flex flex-col gap-4">
                  <h3 className="font-bold text-base md:text-lg">Status</h3>
                  <RadioGroup defaultValue="all" className="flex flex-col gap-3">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="all" id="status-all" />
                      <Label htmlFor="status-all" className="text-sm font-medium">All</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="active" id="status-active" />
                      <Label htmlFor="status-active" className="text-sm font-medium">Active</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="completed" id="status-completed" />
                      <Label htmlFor="status-completed" className="text-sm font-medium">Completed</Label>
                    </div>
                  </RadioGroup>
                </div>

                <Separator />

                {/* Categories Section */}
                <div className="flex flex-col gap-4">
                  <h3 className="font-bold text-base md:text-lg">Categories</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {CATEGORIES.map((category) => (
                      <div key={category.id} className="flex items-center space-x-3">
                        <Checkbox id={`cat-${category.id}`} />
                        <Label
                          htmlFor={`cat-${category.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {category.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>

            <div className="mt-auto pt-4 border-t flex gap-3">
              <CustomButton variant="outline" className="flex-1 rounded-full h-10">
                Reset
              </CustomButton>
              <CustomButton className="flex-1 rounded-full h-10">
                Apply Filters
              </CustomButton>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}