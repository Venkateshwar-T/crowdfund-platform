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
  }, [lastScrollY]);

  const content = {
    Active: { label: 'Drive Impact', sub: 'Help this cause', btn: 'Contribute Now' },
    Successful: { label: 'Target Met', sub: 'Goal successfully reached', btn: 'Campaign Ended' },
    Failed: { label: 'Campaign Ended', sub: 'Funding goal not reached', btn: 'Claim Refund' }
  }[status];

  return (
    <div 
      className={cn(
        "fixed left-0 right-0 z-40 px-4 transition-all duration-500 ease-in-out md:left-1/2 md:-translate-x-1/2 md:max-w-4xl md:px-0",
        visible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0 pointer-events-none",
        "md:bottom-8",
        isNavVisible ? "bottom-[calc(4rem+1rem)]" : "bottom-4"
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
          onClick={onContribute}
          disabled={status === 'Successful'}
          className={cn(
            "h-10 md:h-12 px-6 md:px-8 rounded-xl font-black text-xs md:text-sm shadow-lg transition-transform active:scale-95",
            status === 'Active' ? "bg-primary hover:bg-primary/90 shadow-primary/20" : 
            status === 'Failed' ? "bg-white text-destructive hover:bg-white/90 shadow-black/10" :
            "bg-white/10 text-white border border-white/20"
          )}
        >
          {content.btn}
        </CustomButton>
      </div>
    </div>
  );
}