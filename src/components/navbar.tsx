
'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import { CustomSearchBar } from './custom-search-bar';
import { CustomButton } from './custom-button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus the input when search mode is activated
  useEffect(() => {
    if (isSearching && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearching]);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="relative flex h-16 items-center px-4 md:px-6">
        
        {/* Normal Navbar Content - Fades away when searching */}
        <div className={cn(
          "flex items-center justify-between w-full transition-all duration-500 ease-in-out",
          isSearching ? "opacity-0 pointer-events-none scale-95" : "opacity-100 scale-100"
        )}>
          {/* Left Section: Logo, Navigation, and Search Trigger */}
          <div className="flex items-center gap-4 md:gap-8 flex-1">
            <Link href="/" className="text-2xl font-bold tracking-tight text-primary whitespace-nowrap">
              CrowdFund
            </Link>
            
            <div className="hidden lg:flex items-center gap-6">
              <Link 
                href="/" 
                className="text-sm font-medium transition-colors hover:text-primary whitespace-nowrap"
              >
                Home
              </Link>
              <Link 
                href="/browse" 
                className="text-sm font-medium transition-colors hover:text-primary whitespace-nowrap"
              >
                Browse
              </Link>
            </div>

            <div className="hidden sm:block flex-1 max-w-sm ml-4">
              <CustomSearchBar onClick={() => setIsSearching(true)} />
            </div>
          </div>

          {/* Right Section: Actions */}
          <div className="flex items-center gap-4 md:gap-6 shrink-0">
            <Link 
              href="/how-it-works" 
              className="hidden text-sm font-medium transition-colors hover:text-primary md:block whitespace-nowrap"
            >
              How it Works
            </Link>
            <CustomButton variant="default" className="rounded-full px-4 md:px-6 whitespace-nowrap">
              Connect Wallet
            </CustomButton>
            {/* Mobile Search Trigger */}
            <button 
              onClick={() => setIsSearching(true)}
              className="sm:hidden p-2 hover:bg-accent rounded-full transition-colors"
            >
              <Search className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Expanded Search Bar - Covers the whole navbar */}
        <div className={cn(
          "absolute inset-0 flex items-center px-4 md:px-6 transition-all duration-500 ease-in-out bg-background",
          isSearching ? "opacity-100 translate-y-0" : "opacity-0 pointer-events-none translate-y-2"
        )}>
          <button 
            onClick={() => setIsSearching(false)}
            className="p-2 -ml-2 hover:bg-accent rounded-full transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="h-6 w-6 text-muted-foreground" />
          </button>
          
          <div className="flex-1 relative mx-4">
            <Input
              ref={searchInputRef}
              type="text"
              placeholder="Search fundraisers, categories, or cities..."
              className="h-12 w-full border-0 bg-transparent rounded-none px-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-lg placeholder:text-muted-foreground/40 shadow-none"
              onKeyDown={(e) => {
                if (e.key === 'Escape') setIsSearching(false);
              }}
            />
            {/* Thick bottom line */}
            <div className="absolute bottom-0 left-0 h-[2px] w-full bg-primary" />
          </div>

          <Search className="h-6 w-6 text-primary shrink-0" />
        </div>
      </div>
    </nav>
  );
}
