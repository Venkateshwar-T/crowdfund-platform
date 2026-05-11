'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { CustomButton } from '@/components/shared/custom-button';

interface FloatingCTAProps {
  onContribute: () => void;
  visible: boolean;
  status: 'Active' | 'Successful' | 'Failed';
}

export function FloatingCTA({ onContribute, visible, status }: FloatingCTAProps) {
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    if (status !== 'Active') return; // Don't hide for inactive states

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsNavVisible(false);
      } else {
        setIsNavVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, status]);

  const isEnded = status === 'Successful' || status === 'Failed';
  
  // If ended, it stays visible forever as an info bar
  const finalVisible = isEnded ? true : visible;
  const finalNavVisible = isEnded ? true : isNavVisible;

  const content = {
    Active: { label: 'Drive Impact', sub: 'Help this cause', btn: 'Contribute Now' },
    Successful: { label: 'Target Met', sub: 'Goal successfully reached', btn: 'Campaign Ended' },
    Failed: { label: 'Campaign Ended', sub: 'Funding goal not reached', btn: 'Refunds Available' }
  }[status];

  return (
    <div 
      className={cn(
        "fixed left-0 right-0 z-40 px-4 transition-all duration-500 ease-in-out md:left-1/2 md:-translate-x-1/2 md:max-w-4xl md:px-0",
        finalVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none",
        "md:bottom-8",
        finalNavVisible ? "bottom-[calc(4rem+1rem)]" : "bottom-4"
      )}
    >
      <div className={cn(
        "p-3 md:p-4 rounded-2xl md:rounded-3xl text-white flex items-center justify-between gap-4 shadow-2xl ring-1 ring-white/10 backdrop-blur-xl",
        status === 'Failed' ? "bg-destructive/90" : "bg-foreground/90"
      )}>
        <div className="pl-2">
          <p className="text-[10px] md:text-xs text-white/60 font-bold uppercase tracking-widest">{content.label}</p>
          <p className="text-xs md:text-sm font-bold">{content.sub}</p>
        </div>
        <CustomButton 
          onClick={status === 'Active' ? onContribute : undefined}
          disabled={status !== 'Active'}
          className={cn(
            "h-10 md:h-12 px-6 md:px-8 rounded-xl font-black text-xs md:text-sm shadow-lg",
            status === 'Active' ? "bg-primary hover:bg-primary/90 shadow-primary/20" : "bg-white/10 text-white border border-white/20"
          )}
        >
          {content.btn}
        </CustomButton>
      </div>
    </div>
  );
}
