'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Search, CircleHelp, Menu, X, Home, Compass } from 'lucide-react';
import { CustomSearchBar } from './custom-search-bar';
import { CustomButton } from './custom-button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [isSearching, setIsSearching] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus the input when search mode is activated
  useEffect(() => {
    if (isSearching && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearching]);

  // Close menu if searching starts
  useEffect(() => {
    if (isSearching) setIsMenuOpen(false);
  }, [isSearching]);

  const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link 
      href={href} 
      className="relative group py-1 px-1"
    >
      <span className="block text-sm font-medium transition-transform duration-300 ease-out group-hover:-translate-y-1 whitespace-nowrap">
        {children}
      </span>
      <span className="absolute bottom-0 left-0 h-[2px] w-full bg-primary rounded-full origin-left scale-x-0 opacity-0 transition-[transform,opacity] duration-300 ease-out group-hover:scale-x-100 group-hover:opacity-100" />
    </Link>
  );

  const MobileNavLink = ({ href, icon: Icon, children }: { href: string; icon: any; children: React.ReactNode }) => (
    <Link 
      href={href} 
      onClick={() => setIsMenuOpen(false)}
      className="flex items-center gap-4 px-6 py-4 hover:bg-accent transition-colors border-b last:border-0"
    >
      <Icon className="h-5 w-5 text-primary" />
      <span className="text-base font-medium">{children}</span>
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="relative flex h-16 items-center px-4 md:px-6">
        
        {/* Normal Navbar Content */}
        <div className={cn(
          "flex items-center justify-between w-full transition-all duration-500 ease-in-out",
          isSearching ? "opacity-0 pointer-events-none scale-95" : "opacity-100 scale-100"
        )}>
          {/* Left Section: Logo, Navigation, and Search Trigger */}
          <div className="flex items-center gap-4 md:gap-6 flex-1 min-w-0">
            <Link href="/" className="text-2xl font-bold tracking-tight text-primary whitespace-nowrap shrink-0">
              CrowdFund
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4 md:gap-6">
              <NavLink href="/">Home</NavLink>
              <NavLink href="/browse">Browse</NavLink>
            </div>

            {/* Medium screen search bar */}
            <div className="hidden md:block lg:hidden w-full max-w-[120px] ml-4">
              <CustomSearchBar placeholder="Search" onClick={() => setIsSearching(true)} />
            </div>

            {/* Large screen search bar */}
            <div className="hidden lg:block w-full max-w-[240px] ml-4">
              <CustomSearchBar placeholder="Search fundraisers" onClick={() => setIsSearching(true)} />
            </div>
          </div>

          {/* Right Section: Actions */}
          <div className="flex items-center gap-2 md:gap-6 shrink-0 ml-4">
            {/* Help icon - Hidden on mobile */}
            <Link 
              href="/how-it-works" 
              className="hidden md:flex p-2 hover:bg-accent rounded-full transition-colors"
              title="How it Works"
            >
              <CircleHelp className="h-5 w-5 text-muted-foreground" />
            </Link>

            {/* Connect Wallet - Hidden on mobile */}
            <CustomButton variant="default" className="hidden md:flex rounded-full px-4 md:px-6 whitespace-nowrap">
              Connect Wallet
            </CustomButton>

            {/* Mobile Actions */}
            <div className="flex md:hidden items-center gap-1">
              <button 
                onClick={() => setIsSearching(true)}
                className="p-2 hover:bg-accent rounded-full transition-colors"
                aria-label="Search"
              >
                <Search className="h-5 w-5 text-muted-foreground" />
              </button>
              
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 hover:bg-accent rounded-full transition-colors"
                aria-label="Menu"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6 text-primary" />
                ) : (
                  <Menu className="h-6 w-6 text-muted-foreground" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Expanded Search Bar Overlay */}
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
            <div className="absolute bottom-0 left-0 h-[2px] w-full bg-primary rounded-full" />
          </div>

          <Search className="h-6 w-6 text-primary shrink-0" />
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className={cn(
        "md:hidden absolute top-full left-0 w-full bg-background border-b shadow-xl transition-all duration-300 ease-in-out overflow-hidden",
        isMenuOpen ? "max-height-60 opacity-100" : "max-h-0 opacity-0 pointer-events-none"
      )}>
        <div className="flex flex-col bg-background">
          <MobileNavLink href="/" icon={Home}>Home</MobileNavLink>
          <MobileNavLink href="/browse" icon={Compass}>Browse</MobileNavLink>
          <MobileNavLink href="/how-it-works" icon={CircleHelp}>How it Works</MobileNavLink>
        </div>
      </div>
    </nav>
  );
}
