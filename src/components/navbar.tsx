
'use client';

import Link from 'next/link';
import { CustomSearchBar } from './custom-search-bar';
import { CustomButton } from './custom-button';

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Left Section: Logo, Navigation, and Search */}
        <div className="flex items-center gap-6 md:gap-8">
          <Link href="/" className="text-2xl font-bold tracking-tight text-primary">
            CrowdFund
          </Link>
          
          <div className="hidden items-center gap-6 md:flex">
            <Link 
              href="/" 
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Home
            </Link>
            <Link 
              href="/browse" 
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Browse
            </Link>
          </div>

          <div className="hidden lg:block">
            <CustomSearchBar />
          </div>
        </div>

        {/* Right Section: Actions */}
        <div className="flex items-center gap-6">
          <Link 
            href="/how-it-works" 
            className="hidden text-sm font-medium transition-colors hover:text-primary sm:block"
          >
            How it Works
          </Link>
          <CustomButton variant="default" className="rounded-full px-6">
            Connect Wallet
          </CustomButton>
        </div>
      </div>
      
      {/* Mobile Search - Visible only on mobile below the main header */}
      <div className="lg:hidden px-4 pb-3 sm:block md:hidden">
         <CustomSearchBar />
      </div>
    </nav>
  );
}
