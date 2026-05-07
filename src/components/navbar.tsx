'use client';

import Link from 'next/link';
import { CustomSearchBar } from './custom-search-bar';
import { CustomButton } from './custom-button';

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 md:px-6 gap-4">
        {/* Left Section: Logo, Navigation, and Search */}
        <div className="flex items-center gap-4 md:gap-8 flex-1">
          <Link href="/" className="text-2xl font-bold tracking-tight text-primary whitespace-nowrap">
            CrowdFund
          </Link>
          
          <div className="flex items-center gap-4 md:gap-6">
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

          <div className="hidden sm:block flex-1 max-w-sm">
            <CustomSearchBar />
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
        </div>
      </div>
      
      {/* Mobile Search - Visible only on mobile screens (below 'sm' breakpoint) */}
      <div className="sm:hidden px-4 pb-3">
         <CustomSearchBar />
      </div>
    </nav>
  );
}
