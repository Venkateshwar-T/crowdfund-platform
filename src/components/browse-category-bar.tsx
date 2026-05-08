'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight, Heart, Sprout, GraduationCap, Cat, Palette, Venus, Users, Cpu, Trophy, ShieldAlert, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export const CATEGORIES = [
  { id: 'medical', label: 'Medical', icon: Heart },
  { id: 'environment', label: 'Environment', icon: Sprout },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'animals', label: 'Animals', icon: Cat },
  { id: 'arts', label: 'Arts and Media', icon: Palette },
  { id: 'women', label: 'Women', icon: Venus },
  { id: 'elderly', label: 'Elderly', icon: Users },
  { id: 'technology', label: 'Technology', icon: Cpu },
  { id: 'sports', label: 'Sports', icon: Trophy },
  { id: 'disaster', label: 'Disaster Relief', icon: ShieldAlert },
  { id: 'development', label: 'Urban/Rural Development', icon: Building2 },
];

export function BrowseCategoryBar() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="sticky top-16 z-30 w-full bg-background/95 backdrop-blur-sm border-b">
      <div className="max-w-7xl auto px-4 flex items-center h-14 relative group/bar">
        {/* Left Arrow with Fade */}
        <button 
          onClick={() => scroll('left')}
          className="absolute left-0 z-10 w-8 md:w-10 h-full flex items-center justify-start pl-1 bg-gradient-to-r from-background via-background/90 to-transparent hover:text-primary transition-colors"
          aria-label="Scroll Left"
        >
          <ChevronLeft className="h-4 w-4 md:h-6 w-6" />
        </button>

        {/* Scrollable Container */}
        <div 
          ref={scrollRef}
          className="flex items-center gap-3 md:gap-6 overflow-x-auto no-scrollbar scroll-smooth px-6 md:px-8 w-full h-full"
          style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
        >
          {CATEGORIES.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                className={cn(
                  "flex items-center gap-1.5 md:gap-2 whitespace-nowrap text-xs md:text-sm font-medium text-muted-foreground",
                  "hover:text-primary transition-colors py-2 border-b-2 border-transparent hover:border-primary/30"
                )}
              >
                <Icon className="h-3 w-3 md:h-4 md:w-4" />
                {category.label}
              </button>
            );
          })}
        </div>

        {/* Right Arrow with Fade */}
        <button 
          onClick={() => scroll('right')}
          className="absolute right-0 z-10 w-8 md:w-10 h-full flex items-center justify-end pr-1 bg-gradient-to-l from-background via-background/90 to-transparent hover:text-primary transition-colors"
          aria-label="Scroll Right"
        >
          <ChevronRight className="h-4 w-4 md:h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
