'use client';

import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CustomSearchBarProps {
  onClick?: () => void;
  className?: string;
  placeholder?: string;
}

export function CustomSearchBar({ onClick, className, placeholder }: CustomSearchBarProps) {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "relative w-full flex items-center gap-3 cursor-text group",
        className
      )}
    >
      <Search className="h-5 w-5 text-muted-foreground shrink-0 transition-colors group-hover:text-primary" />
      <div className="relative w-full">
        <div className="h-9 w-full flex items-center text-sm text-muted-foreground/60 select-none">
          {placeholder || "Search Campaigns"}
        </div>
        <div className="absolute bottom-0 left-0 h-[1px] w-full bg-muted-foreground/20" />
        <div className="absolute bottom-0 left-0 h-[2px] w-full bg-primary rounded-full origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100" />
      </div>
    </div>
  );
}