'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { User } from 'lucide-react';
import { 
  ArrowLeft, 
  Search, 
  CircleHelp, 
  Menu, 
  X, 
  ChevronRight, 
  Heart, 
  Sprout, 
  GraduationCap, 
  Cat, 
  Palette, 
  Cpu, 
  Trophy, 
  ShieldAlert,
  LayoutGrid
} from 'lucide-react';
import { IoWoman } from "react-icons/io5";
import { MdElderly } from "react-icons/md";
import { CustomSearchBar } from './custom-search-bar';
import { CustomButton } from './custom-button';
import { BrandLogo } from './brand-logo';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useAccount } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';

const BROWSE_CATEGORIES = [
  { id: 'medical', label: 'Medical', icon: Heart },
  { id: 'environment', label: 'Environment', icon: Sprout },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'animals', label: 'Animals', icon: Cat },
  { id: 'arts', label: 'Arts and Media', icon: Palette },
  { id: 'women', label: 'Women', icon: IoWoman },
  { id: 'elderly', label: 'Elderly', icon: MdElderly },
  { id: 'technology', label: 'Technology', icon: Cpu },
  { id: 'sports', label: 'Sports', icon: Trophy },
  { id: 'disaster', label: 'Disaster Relief', icon: ShieldAlert },
];

export function Navbar() {
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const pathname = usePathname();
  const [isSearching, setIsSearching] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBrowseOpen, setIsBrowseOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearching && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearching]);

  useEffect(() => {
    if (isSearching) setIsMenuOpen(false);
  }, [isSearching]);

  const NavLink = ({ href, children, onMouseEnter, onMouseLeave }: { href: string; children: React.ReactNode; onMouseEnter?: () => void; onMouseLeave?: () => void }) => {
    const isActive = pathname === href || (href !== '/' && pathname?.startsWith(href));
    
    return (
      <Link 
        href={href} 
        className={cn("relative group py-1 px-1", isActive && "pointer-events-none")}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <span className={cn(
          "block text-sm font-medium transition-transform duration-300 ease-out whitespace-nowrap",
          isActive ? "-translate-y-1 text-primary" : "group-hover:-translate-y-1"
        )}>
          {children}
        </span>
        <span className={cn(
          "absolute bottom-0 left-0 h-[2px] w-full bg-primary rounded-full origin-left transition-[transform,opacity] duration-300 ease-out",
          isActive ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100"
        )} />
      </Link>
    );
  };

  const MobileNavLink = ({ href, icon: Icon, children }: { href: string; icon: any; children: React.ReactNode }) => {
    const isActive = pathname === href || (href !== '/' && pathname?.startsWith(href));
    return (
      <Link 
        href={href} 
        onClick={() => setIsMenuOpen(false)}
        className={cn(
          "flex items-center gap-4 px-6 py-4 transition-colors border-b last:border-0",
          isActive ? "bg-primary/5 text-primary" : "hover:bg-accent"
        )}
      >
        <Icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-muted-foreground")} />
        <span className="text-base font-medium">{children}</span>
      </Link>
    );
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/90 backdrop-blur-md">
      <div className="relative flex h-16 items-center px-4 md:px-6">
        
        <div className={cn(
          "flex items-center justify-between w-full transition-all duration-500 ease-in-out",
          isSearching ? "opacity-0 pointer-events-none scale-95" : "opacity-100 scale-100"
        )}>
          <div className="flex items-center gap-4 md:gap-6 flex-1 min-w-0">
            <BrandLogo logoSize={48}/>
            
            <div className="hidden md:flex items-center gap-4 md:gap-6 h-16">
              <NavLink href="/">Home</NavLink>
              
              <div 
                className="relative h-full flex items-center"
                onMouseEnter={() => !pathname?.startsWith('/browse') && setIsBrowseOpen(true)}
                onMouseLeave={() => setIsBrowseOpen(false)}
              >
                <NavLink href="/browse">Browse</NavLink>
                
                <div className={cn(
                  "hidden lg:grid absolute top-full left-0 mt-0 pt-2 w-[480px] transition-all duration-200 ease-out origin-top-left",
                  isBrowseOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                )}>
                  <div className="bg-white rounded-2xl shadow-xl border border-border p-4 grid grid-cols-2 gap-1 overflow-hidden z-[100]">
                    {BROWSE_CATEGORIES.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/browse?category=${cat.id}`}
                        className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-primary/5 group/item transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <cat.icon className="h-4 w-4 text-muted-foreground group-hover/item:text-primary transition-colors" />
                          <span className="text-sm font-medium text-foreground group-hover/item:text-primary transition-colors">
                            {cat.label}
                          </span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground/30 group-hover/item:text-primary group-hover/item:translate-x-1 transition-all" />
                      </Link>
                    ))}
                    
                    <div className="col-span-2 mt-2 pt-2 border-t border-border/50">
                      <Link
                        href="/browse"
                        className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-primary/5 group/item transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <LayoutGrid className="h-4 w-4 text-primary" />
                          <span className="text-sm font-bold text-primary">
                            View All Categories
                          </span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-primary group-hover/item:translate-x-1 transition-all" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden md:block lg:hidden w-full max-w-[120px] ml-4">
              <CustomSearchBar placeholder="Search" onClick={() => setIsSearching(true)} />
            </div>

            <div className="hidden lg:block w-full max-w-[240px] ml-4">
              <CustomSearchBar placeholder="Search fundraisers" onClick={() => setIsSearching(true)} />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-6 shrink-0 ml-4">
            <Link 
              href="/how-it-works" 
              className="hidden md:flex p-2 hover:bg-accent rounded-full transition-colors"
              title="How it Works"
            >
              <CircleHelp className="h-5 w-5 text-muted-foreground" />
            </Link>

            {/* <CustomButton variant="default" className="hidden md:flex rounded-full px-4 md:px-6 whitespace-nowrap">
              Connect Wallet
            </CustomButton> */}

            {isConnected ? (
                <Link href="/profile">
                  <CustomButton variant="default" className="hidden md:flex rounded-full px-4 gap-2">
                    <User className="h-4 w-4" />
                    Profile
                  </CustomButton>
                </Link>
              ) : (
                <CustomButton 
                  onClick={openConnectModal} 
                  variant="default"
                  className="hidden md:flex rounded-full px-6 whitespace-nowrap"
                >
                  Connect Wallet
                </CustomButton>
              )}
            
              {/* Replace your CustomButton with this */}
              {/* <WalletConnect />  */}
            

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

        <div className={cn(
          "absolute inset-0 flex items-center px-4 md:px-6 transition-all duration-500 ease-in-out bg-background",
          isSearching ? "opacity-100 translate-y-0" : "opacity-0 pointer-events-none translate-y-2"
        )}>
          <button 
            onClick={() => setIsSearching(false)}
            className="p-2 -ml-2 hover:bg-accent rounded-full transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
          </button>
          
          <div className="flex-1 relative mx-4">
            <Input
              ref={searchInputRef}
              type="text"
              placeholder="Search fundraisers, categories, or cities..."
              className="h-10 md:h-12 w-full border-0 bg-transparent rounded-none px-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm md:text-base placeholder:text-muted-foreground/40 shadow-none"
              onKeyDown={(e) => {
                if (e.key === 'Escape') setIsSearching(false);
              }}
            />
            <div className="absolute bottom-0 left-0 h-[2px] w-full bg-primary rounded-full" />
          </div>

          <Search className="h-4 w-4 md:h-5 md:w-5 text-primary shrink-0" />
        </div>
      </div>

      <div className={cn(
        "md:hidden absolute top-full left-0 w-full bg-background border-b shadow-xl transition-all duration-300 ease-in-out overflow-hidden",
        isMenuOpen ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
      )}>
        <div className="flex flex-col bg-background">
          <MobileNavLink href="/how-it-works" icon={CircleHelp}>How it Works</MobileNavLink>
        </div>
      </div>
    </nav>
  );
}
